import { api, track } from 'lwc';
import LightningModal from 'lightning/modal';
import { loadScript } from 'lightning/platformResourceLoader'; 
import Mammoth_JS from "@salesforce/resourceUrl/Mammoth_JS";

export default class ModalCompenent extends LightningModal {
    @api fileDetails;
    @api rawBuffer;
    
    renderIntiated = false;

    renderedCallback(){
        if(this.renderIntiated && !this.rawBuffer){
            return;
        }
        this.renderIntiated = true;
        loadScript(this, Mammoth_JS).then(() => {
            console.log('Mammoth_JS loaded');
            console.log('Available Functions:', Object.keys(window.mammoth || {}));
            this.renderPreview();
        }).catch(err => {
            console.error('Library failed to load', err);
        });
    }

    async renderPreview() {
    console.log('Inside Render Preview');
    console.log('Buffer:', this.rawBuffer);

    const container = this.template.querySelector('.container');

    if (!container) {
        console.log('Container not found');
        return;
    }

    if (!this.rawBuffer) {
        console.log('Buffer not ready yet');
        return;
    }

    try {
        if (window.mammoth) {
            const result = await window.mammoth.convertToHtml({
                arrayBuffer: this.rawBuffer
            });

            console.log('Mammoth result:', result);

            if (result && result.value) {
                container.innerHTML = result.value;
                console.log('Preview Rendered Successfully');
            } else {
                console.log('No value returned from mammoth');
            }
        } else {
            console.log('Mammoth not available');
        }
    } catch (error) {
        console.error('Mammoth conversion error:', error);
    }
    }
    handleClose() {
        this.close('done');
    }
}  