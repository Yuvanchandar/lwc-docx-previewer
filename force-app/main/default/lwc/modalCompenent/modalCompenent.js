import { api } from 'lwc';
import LightningModal from 'lightning/modal';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadScript } from 'lightning/platformResourceLoader'; 
import Mammoth_JS from "@salesforce/resourceUrl/Mammoth_JS";
import SavingToRecord from "@salesforce/apex/SavingToRecord.SavingToRecord";

export default class ModalCompenent extends LightningModal {
    @api fileDetails;
    @api rawBuffer;
    @api recordId;

    renderIntiated = false;
    isLoaded = false;

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
            const result = await window.mammoth.convertToHtml({arrayBuffer: this.rawBuffer});
            console.log('Mammoth result:', result);
            if (result && result.value) {
                container.innerHTML = result.value;
                console.log('Preview Rendered Successfully');
                this.isLoaded = true;
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
    handleSave(){
        var binary = '';
        var bytes = new Uint8Array(this.rawBuffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        var base64 = window.btoa(binary);
        console.log('recordId', this.recordId);
        SavingToRecord({recordId: this.recordId, base64: base64})
        .then(result => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'File Saved Successfully',
                variant: 'success'
            }));
            this.close('Success');
        }).catch( error=> {
            console.log('Error is', error);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: 'File Not Saved',
                variant: 'error'
            }));
        })
    }
}