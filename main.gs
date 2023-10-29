
/**
 * Copyright © 2019 , 2020 , 2023  saphalpdyl
 * This file is part of Form Attendance which is released under MIT license.
 * See file LICENSE for full license details.
 * 
 */

class NotFoundError extends Error {
  constructor() {
    this.message = "⚠⚠File or Folder not found⚠⚠" ;
    this.name = "NotFoundError";
  }

  showMsg(){
    window.alert(this.message);
  }
}

function start(){

  const drv = DriveApp;
  const ui = SpreadsheetApp.getUi();

  let html = HtmlService.createTemplateFromFile('manager')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setHeight(800)
    .setWidth(800);

  ui.showModalDialog(html , " ");
}

const manageData = (fileExists , data) => { 

  
  const CLASS_PREFIX = PropertiesService.getUserProperties().getProperty('CLASS_PREFIX');
  const LOCAL_FOLDER = DriveApp.getFolderById(PropertiesService.getUserProperties().getProperty('LOCAL_FOLDER_ID'));
  const SLIDES_FOLDER_NAME = PropertiesService.getUserProperties().getProperty('SLIDES_FOLDER_NAME');
  const SAMPLE_FILE_ID = PropertiesService.getUserProperties().getProperty('SAMPLE_FILE_ID');

  try {

    let class_folder_iter = LOCAL_FOLDER.getFoldersByName(CLASS_PREFIX + data['class'])

    if(class_folder_iter.hasNext()) {
      let class_folder = class_folder_iter.next()
      let teaching_material_folder_iter = class_folder.getFoldersByName(SLIDES_FOLDER_NAME);

      if(teaching_material_folder_iter.hasNext()) {
        let teaching_material_folder = teaching_material_folder_iter.next();

        let sample = SlidesApp.openById(SAMPLE_FILE_ID);
        let sampleAsFile = DriveApp.getFileById(SAMPLE_FILE_ID);
        
        if(!fileExists) {
          //Create New Slide
          createNewSlide(data , sampleAsFile , teaching_material_folder)
        }
        else if (fileExists) {
          //Append Slide
          appendToSlide(data , sample , teaching_material_folder)
        }
      }
      else throw NotFoundError;
    }
    else throw NotFoundError;
  } 
  catch (err) {
    if(err instanceof NotFoundError) {
      err.showMsg();
    }
  } 
}

const createNewSlide = (data , sample , teaching_material_folder) => {
  let slides = sample.makeCopy();
  
  let slideAsApp = SlidesApp.openById(slides.getId())
  slideAsApp.getSlides()[0].getPageElements()[2].asShape().getText().setText(data['file_name']);
  
  slides.setName(`${data['unit_number']} | ${data['file_name']}`);
  slides.moveTo(teaching_material_folder)

}

const appendToSlide = (data , sample  , teaching_material_folder) => {
  let files = teaching_material_folder.getFiles();

  while(files.hasNext()) {
    let file = files.next();
    if(file.getName().split(" ")[0] == data['unit_number']) {
      let slide = SlidesApp.openById(file.getId());
      for(let slide_counter = 0 ; slide_counter < sample.getSlides().length ; slide_counter += 1 ) {
        slide.appendSlide(sample.getSlides()[slide_counter]);
      }

      //Selects the first slide of the duplicated array of slides
      //Changes the name to the name of the title after the pipe (|) character
      slide.getSlides()[slide.getSlides().length - sample.getSlides().length].getPageElements()[2].asShape().getText().setText((slide.getName().split(" ").slice(2)).join(''));
      return null;
    }
  }
  throw NotFoundError
}



//Lesson getter
const getLessonData = () => {
  const pr = PropertiesService.getUserProperties();
  const LOCAL_FOLDER = DriveApp.getFolderById(pr.getProperty("LOCAL_FOLDER_ID"));

  const allSubFolders = LOCAL_FOLDER.getFolders();
  let class_folder = [];
  let returningData = {};

  while(allSubFolders.hasNext()) {
    let folder = allSubFolders.next();
    if(folder.getName().substr(0 ,pr.getProperty('CLASS_PREFIX').length) == [pr.getProperty('CLASS_PREFIX')]) {
      class_folder.push(folder);
    }
  }


  for(let folder_count = 0 ; folder_count < class_folder.length ; folder_count += 1) {
    let folder = class_folder[folder_count];
    let teaching_material_files = folder.getFoldersByName(pr.getProperty('SLIDES_FOLDER_NAME'))
      .next()
      .getFilesByType(MimeType.GOOGLE_SLIDES);
    
    let tempLessonNameList = [];
    while(teaching_material_files.hasNext()){
      let file = teaching_material_files.next()
      tempLessonNameList.push(file.getName());
    }
    returningData[class_folder[folder_count].getName().substr(pr.getProperty('CLASS_PREFIX').length)] = tempLessonNameList.sort((a , b) => a.split(" ")[0] - b.split(" ")[0]);
    // Sort numerically
  }
  return returningData;
}

//Js and CSS Includer
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}