let scrapeEmails = document.getElementById('scrapeEmails');
let list = document.getElementById('emailList')

// Handler to receive emails from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Get emails
    let emails = request.emails;

    // Display emails on popup
    if (emails == null || emails.length == 0) {
        // No emails 
        let li = document.createElement('li');
        li.innerText = "No emails found";
        list.appendChild(li);
    } else {
        // Display emails 
        emails.forEach((email) => {
            let li = document.createElement('li');
            li.innerText = email;
            list.appendChild(li);
        });
    }

    return true; // Error 1: Keep the message channel open for async tasks
});


// Button's click event listener 
scrapeEmails.addEventListener("click", async () => {

    //Get current active tab
    let [tab] = await chrome.tabs.query({active: 
    true, currentWindow: true});

    //Execute script to parse emails on page
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: scrapeEmailsFromPage, 
    });
})

// Function to scrape emails
function scrapeEmailsFromPage() {
    
    // RegEx to parse emails from html code
    // const emailRegEx = /[\w\.=-]+@[\w\.-]+\.[\w]{2.3}/gim;
    const emailRegEx = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gim;


    // Parse emails from the HTML of the page 
    let emails = document.body.innerHTML.match(emailRegEx);

    // Send emails to popup 
    chrome.runtime.sendMessage({emails});
}




