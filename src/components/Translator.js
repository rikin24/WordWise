const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs').promises;
const csv = require('csv-parser');
const fs_sync = require('fs');

async function loadJSONData() {
    try {
        const content = await fs.readFile('jargon_data_expanded.json', 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error('Error loading JSON file:', error);
        return [];
    }
}

async function loadCSVData() {
    return new Promise((resolve, reject) => {
        const results = [];
        fs_sync.createReadStream('user_submissions.csv')
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}

async function main() {
    try {
        // Load JSON file
        const jargonData = await loadJSONData();
        
        // Load CSV file
        const userSubmissions = await loadCSVData();
        
        // Simplify jargon_data into a dictionary of terms and definitions
        const jargonDict = {};
        jargonData.forEach(item => {
            if (item.term && item.definition) {
                jargonDict[item.term] = item.definition;
            }
        });
        
        // Build a supplemental dictionary from CSV
        const submittedJargon = {};
        userSubmissions.forEach(row => {
            if (row.term && row.definition && row.example) {
                submittedJargon[row.term] = {
                    definition: row.definition,
                    example: row.example
                };
            }
        });
        
        // Combine terms from both sources
        const jargonTerms = Object.entries(jargonDict)
            .map(([term, definition]) => `${term}: ${definition}`)
            .join('\n');
        
        const submittedTerms = Object.entries(submittedJargon)
            .map(([term, details]) => `${term}: ${details.definition}`)
            .join('\n');
        
        const combinedTermsText = jargonTerms + '\n' + submittedTerms;
        
        // Combine examples from both sources
        const combinedExamplesText = Object.values(submittedJargon)
            .map(details => details.example)
            .join('\n');
        
        // Configure Google Generative AI
        const genAI = new GoogleGenerativeAI("AIzaSyA2h30rLiYuSgzB13zJEwSpie1w3Wlyui8");
        
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: `You are a translation engine specializing in corporate jargon. Do not add any 
            additional context or explanations. Only translate the provided sentences into corporate consulting 
            jargon.
    Reference the following terms if relevant, but feel free to improvise beyond them.

    --- Terms ---
    ${combinedTermsText}

    --- Examples ---
    ${combinedExamplesText}

    Translate the following plain sentence into corporate consulting jargon:
    "Hello."`
        });
        
        const response = await model.generateContent("Translate to corporate consulting jargon: Hello.");
        console.log(response.response.text());
        
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
