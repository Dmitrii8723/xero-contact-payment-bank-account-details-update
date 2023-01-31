import { XeroClient } from 'xero-node';

const xero = new XeroClient({
  clientId: 'client_id',
  clientSecret: 'client_secret',
  grantType: 'client_credentials',
});


async function setupXeroAndGetTenantID() {
  const tokenSet = await xero.getClientCredentialsToken();
  await xero.setTokenSet(tokenSet);
  await xero.updateTenants();
  console.log('xero.tenants?.[0]?.tenantId', xero.tenants?.[0]?.tenantId)
  return xero.tenants?.[0]?.tenantId;
}

async function findXeroContactByEmail(tenantId, email) {
  const ifModifiedSince = undefined;
  const ids = [];
  const page = 1;
  const includeArchived = false;
  const summaryOnly = true;
    const { body } = await xero.accountingApi.getContacts(
      tenantId,
      ifModifiedSince,
      `emailAddress=="${email.trim()}"`,
      'Name ASC',
      ids,
      page,
      includeArchived,
      summaryOnly
    );
    return body?.contacts?.[0];
}

async function updateContactPaymentDetails(tenantId, contactID, contacts) {
  await xero.accountingApi.updateContact(tenantId, contactID, contacts);
}

const tenantId = await setupXeroAndGetTenantID();

const foundAccount = await findXeroContactByEmail(tenantId, 'email')

const { contactID } = foundAccount;

const contacts = { contacts: [
  {
    bankAccountDetails: "123-4561234567999",
  },
]
};

await updateContactPaymentDetails(tenantId, contactID, contacts);