# GimmeEmail

> Collects emails of subscribers

## Description

Serverless app that listens for subscribe requests, validates email addresses and stores them in DB.


## Prerequisite

Install Azure CLI - [Azure CLI installation guide](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).

## Usage

```
# if haven't authorized yet:
az login 

# run deploy scripts with desired resource name and location, e.g.
sh deploy.sh MyResourceGroup westeurope

```

After app is deployed, the following request stores e-mail in DB:

```
curl --data "email=email@example.com" <url>
```

To delete your published app and data:

```
az group delete -g MyResourceGroup
```
