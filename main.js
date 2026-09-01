//// find elements and define variables
const infoModal = document.getElementById("info-modal");
const infoClose = document.getElementById("info-close");
const infoOpen = document.getElementById("info-open");

const fileSelector = document.getElementById("file-input");
const tablePreview = document.getElementById("table-preview");
const outputSectionElement = document.getElementById("output-section");

//// modal logic
infoClose.addEventListener("click", (e) => {
    infoModal.close();
});
infoOpen.addEventListener("click", (e) => {
    infoModal.showModal();
});

//// file upload and conversion
// framework for this came from here!
// https://dev.to/dataformathub/transform-csv-data-to-html-tables-for-web-display-a-comprehensive-guide-443


function fileInput(e){
    const csvFile = e.target.files[0];
    if(csvFile){
        const reader = new FileReader();
        // we want to run this only after the file is loaded, which might take some time so we put it in an eventlistener
        reader.addEventListener("load", (e) => {
            const csvText = e.target.result;
            const htmlTable = convertCSVToTable(csvText);
            //console.log(htmlTable);
            // before allowing user to download as text file preview in browser
            tablePreview.innerHTML = htmlTable;
            createDownloadLink(htmlTable);
        });
        // here we tell our reader to load our file and interpret it as text, triggering the above "load" event
        reader.readAsText(csvFile);
    } else {
        alert("something went wrong with your upload");
    }
}

fileSelector.addEventListener("change", fileInput);

// this is a pretty manual way to do it but will work
function convertCSVToTable(csvText){
    // this splits our csv into an array of individual lines : uncomment the console to check it out
    const csvTextLines = csvText.split(/\r?\n/);
    // console.log(csvTextLines);
    // here we begin the html we will eventually return : we're saving it as a string, using the `` rather than "" or ''
    // so we can put it over multiple lines : you'll notice all the strings end with /n : this is to say, go to a new
    // line. i also use spacing at the start of following lines so the output will have good formatting
    // formatting
    let htmlTable = `<table>\n\n`;
    // you can see an example here : we're adding the open tags, then we'll add the content followed by the closing tags
    // on line
    htmlTable += `    <thead><tr>\n\n`;
    // we don't have headers baked into our CSV's so we'll create some boilerplate ones to change later. we do however
    // need to know how many fields we have, so I'll split the first line into its individual fields and count them
    let headerFields = csvTextLines[0].split(",").length;
    // once we know how many, we use that to add the headers through a for loop
    for(let i = 0; i <headerFields; i++){
        htmlTable += `        <th>header${i}</th>\n`;
    }
    // add new line break after headers, then close tags
    htmlTable += `\n`;
    htmlTable += `    </thead></tr>\n\n`;
    // ok now we want to insert our actual information
    // we work with much the same logical as above, going row by row, cell by cell
    htmlTable += `    <tbody>\n\n`;
    // again we're using a for loop, but doing so based on the number of lines from our split at the top of the function
    csvTextLines.forEach((line) => {
        // first check there's something in the line : if nothing ie length = 0 then don't run
        if(line.length === 0){
            return;
        }
        // split each line out into its field values
        const lineValues = line.split(",");
        // open row element
        htmlTable += `      <tr>\n\n`;
        // again for loop, this time on field values per line
        lineValues.forEach((value) => {
            htmlTable += `        <td>${value}</td>\n`;
        });
        // close row element
        htmlTable += `\n`;
        htmlTable += `      </tr>\n\n`;
    });
    htmlTable += `    </tbody>\n\n`;
    // finally close our main table tag
    htmlTable += `</table>`;
    return htmlTable;
}

function createDownloadLink(htmlTable) {
    // first we need to make sure to get rid of any existing download links
    const oldLink = document.getElementById("table-download");
    // if this finds something, we delete it before adding a new link with the same id
    if(oldLink){
        oldLink.remove();
    }
    // create our file as a blob : we give it our table string and then tell it to be a plain text file
    const htmlTableFile = new Blob([htmlTable], { type: "text/plain" });
    // now create our new link
    const newLink = document.createElement("a");
    // add file to href as URL created from the blob
    newLink.href = URL.createObjectURL(htmlTableFile);
    // give the download a name
    newLink.download = "myHTMLTable.txt";
    newLink.innerText = "Download table as txt file";
    // then add id so we can replace if needed
    newLink.id = "table-download";
    // finally add to our DOM in our main element
    outputSectionElement.appendChild(newLink);
}