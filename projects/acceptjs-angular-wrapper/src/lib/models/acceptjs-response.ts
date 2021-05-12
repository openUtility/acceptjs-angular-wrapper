export class AcceptJSResponse {
    opaqueData: { dataDescriptor: string, dataValue: string };
    messages: {
        resultCode: string,
        message: {code: string, text: string}[]
    };
}
