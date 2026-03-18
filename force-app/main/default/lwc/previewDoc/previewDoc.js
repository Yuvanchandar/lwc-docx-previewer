import { LightningElement, api } from 'lwc';
import ModalCompenent from 'c/modalCompenent';

export default class FileUploadWithPreview extends LightningElement {
    @api recordId;
    @api fileDetails;
    @api container;
    fileName;

    handleFiles(event) {
        const file = event.target.files[0];
        this.fileDetails = file;
        this.fileName = file.name;
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async(e) => {
            this.rawBuffer = e.target.result;   
            await ModalCompenent.open({
                label: 'Previewing Doc',
                iconName: 'standard:file',
                size: 'medium',
                fileDetails: this.fileDetails,
                rawBuffer: this.rawBuffer,
                fileName: this.fileName,
                recordId: this.recordId
            });
            event.target.value = '';
        };
        reader.readAsArrayBuffer(file);
    }
}