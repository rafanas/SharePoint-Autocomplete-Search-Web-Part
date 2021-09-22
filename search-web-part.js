  // Declare Assets
  const apiUrl = "/test3/_api/web/lists/GetByTitle('Contacts')/items";
  const inputField = document.getElementById("contact-search-field");
  const contactList = document.getElementById("contact-items");
  const contactNote = document.getElementsByClassName("contactNote");
  contactList.style.display = "flex";
  // Define Intentions
  const payload = {
      credentials: "same-origin",
      headers: {
          Accept: "application/json; odata=verbose"
      },
      method: "GET"
  };
  // Make the Search
  const searchContacts = async getContacts => {
      const response = await fetch(apiUrl, payload);
      const contactsArray = await response.json();
      const items = contactsArray.d.results;
      //Display results that matches the input value
      let matches = items.filter(item => {
          const regex = new RegExp(`^${inputField.value}`, 'gi');
          return item.Title.match(regex) || item.FirstName.match(regex);
      });
      // If the Search Input is empty, Clear & Do nothing
      if (getContacts.length === 0) {
          matches = [];
          contactList.innerHTML = "";
      }
      // If There is an Input, Display results in page.
      outputHtml(matches);
  };

  //Format Results
  const outputHtml = matches => {
      if (matches.length > 0) {

          //Create an element for each result
          const eachResult = matches.map(contact => `
          <section class="contact-result">
              <input class="contact-check" type="checkbox" value="${contact.Contact_x0020_ID}">
              <span title="${contact.FirstName} "><b>${contact.FirstName}</b></span>
              <span title="${contact.Title}"><b>${contact.Title}</b></span>
              <span title="${contact.JobTitle}"> - ${contact.JobTitle} @ </span>
              <span title="${contact.Company}" class="gray-text">${contact.Company}</a></span><br>
              <hr>
              <a href="https://www.google.com/maps/search/?api=1&query=${contact.WorkAddress}+${contact.WorkCity}+${contact.WorkState}" target="_blank">
                  <span title="${contact.WorkAddress}"> &#9873; ${contact.WorkAddress} </span>
                  <span title="${contact.WorkCity}">${contact.WorkCity},</span>
                  <span title="${contact.WorkState}">${contact.WorkState}<br></span>
              </a> 
                  <span title="${contact.Email}"><b>Email:</b><a href="mailto:${contact.Email}"> ${contact.Email}</a></span>
                  <span title="${contact.Website}"> - <b>Web:</b> <a href="${contact.Website}" target="_blank">${contact.Website}</a></span> <br>
                  <span title="${contact.WorkPhone}"> <b>Work:</b><a href="tel:${contact.WorkPhone}"> ${contact.WorkPhone}</a>  </span> 
                  <span title="${contact.CellPhone}"> - <b>Mobile:</b><a href="tel:${contact.CellPhone}"> ${contact.CellPhone}</a> </span>
          
          
              <span title="${contact.Comments}" class="contactNote"><hr style="margin-bottom: 9px;"><b>Notes: </b>${contact.Comments}</span>
          </section>`).join("");



          //Populate DOM with results
          contactList.innerHTML = eachResult;
          //Hide empty information about the contact
          $("span[title='null']").css('display', 'none');

          //Get value when a result is checked
          $(".contact-check").on('change', function () {
              // Add style to checked element
              if ($(this).is(":checked")) {
                  $(this).parent().addClass("isChecked");
              }
              //Remove style if unchecked
              $(".contact-check").not(this).parent().removeClass("isChecked");
              //Prevent checking more than one box
              $("input[type='checkbox']").not(this).prop('checked', false);
              // Store input
              const rightID = this.value;
              //Loop through Lookup Field options to find a value that matches input with result
              $("select[title='Contact ID'] > option").each(function () {
                  //If Input equals the Look Up field
                  if ($(this).text() === rightID) {
                      //Push the result to Lookupfield and select the contact 
                      $("select[title='Contact ID']").val($(this).val());
                      $("select[title='Contact ID']").addClass('field-updated');
                  }
              });
          });
      }
  };

  //Search Input Listener receives information to trigger a contact search
  inputField.addEventListener('input', () => searchContacts(inputField.value));