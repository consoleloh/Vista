$(document).ready(function(){
  var model = [{
    id: 'patientsPresent',
    props: {
      url: './js/presentList.json',
      inputs: {
        index: 'js-patient-index-input',
        name: 'js-patient-name-input',
        bedNumber: 'js-patient-bed-input'
      },
      data: []
    }
  }, {
    id: 'patientsQuitting',
    props: {
      url: './js/quittingList.json',
      inputs: {
        index: 'js-patient-index-input',
        name: 'js-patient-name-input',
        cause: 'js-patient-cause-input'
      },
      data: []
    }
  }];
  
  function createTable(table){
    $.ajax({
      url: table.props.url,
      dataType: 'json',
      success: function(data){
        table.props.data = updateData(data);
        createRows(table);
        setRowsCount(table);
      }
    });
  }

  function createRows(table){
    var tr, tdText, className;

    table.props.data.forEach(function(patient, index){
      tr = $('<tr class="js-click-patient" data-index="' + index + '"></tr>');

      Object.entries(table.props.inputs).forEach(function(input){
        tdText = patient[input[0]];
        className = input[1];

        $('<td class="' + className + '">' + tdText + '</td>').appendTo(tr);
      });

      tr.appendTo('#' + table.id + ' tbody');
      tr.bind('click', setPatientDetails);
    });
  }

  function setRowsCount(table){
    $('[href="#' + table.id + '"] .js-patients-count-input').text('(' + table.props.data.length + ')');
  }

  function updateData(data){
    var updatedData = [];

    data.forEach(function(patient, index){
      patient.index = ++index;
      patient.name = patient.firstName + ' ' + patient.lastName + ' ' + patient.patrName;
      patient.age = getAge(patient.birthDate);

      updatedData.push(patient);
    });

    return updatedData;
  }

  function getAge(date){
      var today = new Date();
      var birthDate = new Date(date);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())){
          age--;
      }

      return age;
  }

  function setPatientDetails(){
    var patientRow = $(this);
    var patientIndex = patientRow.data('index');
    var table = patientRow.closest('.c-table');
    var tableId = table.attr('id');
    var patient;

    table.find('tr.active').removeClass('active');
    
    var patientDetailsNameInput = $('#patientDetails .js-patient-name-input');
    var patientDetailsAgeInput = $('#patientDetails .js-patient-age-input');
    var patientDetailsDiagnosisInput = $('#patientDetails .js-patient-diagnosis-input');

    model.forEach(function(table){
      if (table.id === tableId && table.props.data[patientIndex]){
        patient = table.props.data[patientIndex];
      }
    });

    if (patient){
      patientDetailsNameInput.text(patient.name);
      patientDetailsAgeInput.text(patient.age);
      patientDetailsDiagnosisInput.text(patient.diagnosis);

      patientRow.addClass('active');
    }
  }

  function tabsInit(){
    var activeTab = $('.c-tabs__item--active');
    var activeTabHref = activeTab.attr('href');
    var activeTabContent = $(activeTabHref);

    activeTabContent.show();

    $('.c-tabs__item').click(function(e){
      var currentActiveTab = $(this);
      var currentActiveTabHref = currentActiveTab.attr('href');
      var currentActiveTabContent = $(currentActiveTabHref);

      activeTab = $('.c-tabs__item--active');
      activeTabHref = activeTab.attr('href');
      activeTabContent = $(activeTabHref);

      activeTab.removeClass('c-tabs__item--active');
      activeTabContent.hide();

      currentActiveTab.addClass('c-tabs__item--active');
      currentActiveTabContent.show();

      e.preventDefault();
    });
  }
  
  function init(){
    tabsInit();
    model.forEach(function(table){
      createTable(table);
    });
  }

  init();
});