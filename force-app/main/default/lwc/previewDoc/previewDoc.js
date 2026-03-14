import { LightningElement, api, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import Mammoth_JS from "@salesforce/resourceUrl/Mammoth_JS";

export default class FileUploadWithPreview extends LightningElement {
    @api recordId;
    @track fileDetails;
    fileName;

    connectedCallback() {
        loadScript(this, Mammoth_JS).then(() => {
            console.log('Mammoth_JS loaded');
            console.log('Available Functions:', Object.keys(window.mammoth || {}));
        }).catch(err => {
            console.error('Library failed to load', err);
        });
    }

    handleFiles(event) {
        const file = event.target.files[0];
        if (!file) return;

        // 1. Check for Mammoth before starting
        if (!window.mammoth) {
            console.error('Mammoth library is not ready.');
            return;
        }

        const reader = new FileReader();

        reader.onload = async (e) => {
            const rawBuffer = e.target.result;
            const cleanBuffer = new Uint8Array(rawBuffer).buffer; 

            try {
                console.log('Starting conversion...');
                const result = await window.mammoth.convertToHtml({ arrayBuffer: cleanBuffer });
                this.fileDetails = {
                    name: file.name,
                    size: file.size,
                    type: file.type
                };
                this.fileName = file.name;
                setTimeout(() => {
                    const container = this.template.querySelector('.container');
                    if (container && result.value) {
                        container.innerHTML = result.value;
                        console.log('Preview Rendered Successfully');
                    }
                }, 500);

            } catch (err) {
                console.error('Mammoth Parsing Error: ', err.message);
            }
        };
        reader.readAsArrayBuffer(file);
    }
}