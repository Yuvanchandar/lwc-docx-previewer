import { api, track } from 'lwc';
import LightningModal from 'lightning/modal';
import { loadScript } from 'lightning/platformResourceLoader'; 
import Mammoth_JS from "@salesforce/resourceUrl/Mammoth_JS";

export default class ModalCompenent extends LightningModal {
    @api fileDetails;
    @api rawBuffer;
    
    @track libLoaded = false;
    @track hasRendered = false;

    connectedCallback () {
        if (this.libLoaded) {
            return;
        }

        loadScript(this, Mammoth_JS).then(() => {
            this.libLoaded = true;
            console.log('Mammoth_JS loaded');
            console.log('Available Functions:', Object.keys(window.mammoth || {}));
        }).catch(err => {
            console.error('Library failed to load', err);
            this.libLoaded = true;
        });
    }

    renderedCallback(){
        if (!this.hasRendered && this.libLoaded) {
           this.renderPreview();
        }
    }

    async renderPreview() {
        const container = this.template.querySelector('.container');
        
        if (!container || !this.rawBuffer) {
            this.hasRendered = true;
            return;
        }
        
        try {
            if (window.mammoth) {
                const result = await window.mammoth.convertToHtml({ arrayBuffer: this.rawBuffer });                    
                if (result && result.value) {
                    container.innerHTML = result.value;
                    console.log('Preview Rendered Successfully');
                }
            } else {
                console.warn('Mammoth library not available');
            }
        } catch (error) {
            console.error('Mammoth conversion error:', error);
        } finally {
            this.hasRendered = true;
        }
    }
    handleClose() {
        this.close('done');
    }
}