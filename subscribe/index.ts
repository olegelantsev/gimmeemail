import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as EmailValidator from 'email-validator';
import {cosmosDb} from './dbRepository';

async function addItem(email: string) {
    const doc = await cosmosDb.addItem({
        email,
        dateAdded: new Date(),
    });

    return doc != null;
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    let success = false;
    if (req.body && req.body.startsWith('email=')) {
        const emailCandidate = decodeURIComponent(req.body.replace('email=', ''));
        if (EmailValidator.validate(emailCandidate)) {
            success = await addItem(emailCandidate);
            context.res = {
                status: success ? 200 : 500
            };
            return;
        }
    }
    
    context.res = {
        status: 400
    };
};

export default httpTrigger;
