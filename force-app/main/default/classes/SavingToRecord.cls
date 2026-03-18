public with sharing class SavingToRecord {
    @AuraEnabled
    public static void SavingToRecord(Id recordId, String base64) {
        Blob fileBlob = EncodingUtil.base64Decode(base64);
        ContentVersion cv = new ContentVersion();
        cv.Title = 'Uploaded File';
        cv.PathOnClient = cv.Title+'.docx';
        cv.VersionData = fileBlob;
        insert cv;

        Id contentDocumentId = [Select contentDocumentId from ContentVersion where Id = :cv.Id].contentDocumentId;

        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.LinkedEntityID = recordId;
        cdl.ContentDocumentId = contentDocumentId;
        cdl.ShareType = 'V';
        insert cdl;
    }
}