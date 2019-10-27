#!/bin/bash -ex

resourceGroup=$1
location=$2

az group create -n $resourceGroup -l $location

unique=$(uuidgen  | cut -d '-' -f1)
accountName="cosmos-$unique"
storageAccountName="storageaccount$unique"
functionAppName="funcs-app-$unique"
databaseName="Db$unique"
containerName="cont$unique"

az storage account create \
  -n $storageAccountName \
  -l $location \
  -g $resourceGroup \
  --sku Standard_LRS \


az functionapp create \
  -n $functionAppName \
  --storage-account $storageAccountName \
  --consumption-plan-location $location \
  --runtime node \
  -g $resourceGroup

# Create a Cosmos account for SQL API
az cosmosdb create -n $accountName --resource-group $resourceGroup 

# Create a SQL API database
az cosmosdb database create \
    -n $accountName \
    -g $resourceGroup \
    -d $databaseName

az cosmosdb keys list  -n $accountName -g $resourceGroup --type connection-strings
kvpairs=$(az cosmosdb keys list  -n $accountName -g $resourceGroup --type connection-strings | jq ".connectionStrings[0].connectionString")
echo $kvpairs

# Create container
az cosmosdb sql container create -g $resourceGroup -a $accountName -d $databaseName -n $containerName

function read_value {
  key=$1
  echo $kvpairs | grep -Po  "$key=([^;]*)" | sed "s/$key=//g"
}

authKey=$(read_value AccountKey)
connectionString=$(read_value AccountEndpoint)

az functionapp config appsettings set --settings "HOST=$connectionString" "AUTH_KEY=$authKey" "DATABASE_ID=$databaseName" "CONTAINER_ID=$containerName" --name $functionAppName --resource-group $resourceGroup

func azure functionapp publish $functionAppName --typescript
