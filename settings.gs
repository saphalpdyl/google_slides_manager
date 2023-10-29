/**
 * Copyright © 2019 , 2020 , 2023  saphalpdyl
 * This file is part of Form Attendance which is released under MIT license.
 * See file LICENSE for full license details.
 * 
 */

 //Open html
const settings = () => {
  let html = HtmlService.createTemplateFromFile('settingsPage')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setWidth(800)
    .setHeight(1200);

  return SpreadsheetApp.getUi().showModalDialog(html , " ")
}

//Getter
const getProperties = () => PropertiesService.getUserProperties().getProperties();
//Setter
const setProperties = (prps) =>PropertiesService.getUserProperties().setProperties(prps);

//Js and CSS Includer
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}