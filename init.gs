/**
 * Copyright © 2019 , 2020 , 2023  saphalpdyl
 * This file is part of Form Attendance which is released under MIT license.
 * See file LICENSE for full license details.
 * 
 */

//Initialize User Properties
const init = () => {
  let x91bG21 = PropertiesService.getUserProperties();
  if(Object.keys(x91bG21).length === 0) {
    x91bG21.setProperties({
    LOCAL_FOLDER_ID :  "",
    SLIDES_FOLDER_NAME : "",
    CLASS_PREFIX : "",
    SAMPLE_FILE_ID : "",
    });
  }
  else SpreadsheetApp.getUi().alert("Already Initialized")
}

//Factory Delete Properties
const resetProperties = () => PropertiesService.getUserProperties().deleteAllProperties();

//Factory reset
const factoryReset = () => {

  const ui  = SpreadsheetApp.getUi();
  if(ui.alert("⚠️⚠️Are you sure you want to factory reset ?⚠️⚠️" , ui.ButtonSet.YES_NO) == ui.Button.YES) {
  resetProperties();
  init();
  }
}