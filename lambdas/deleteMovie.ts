import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
const ddbClient = new DynamoDBClient({ region: process.env.REGION });
const dynamoDB = DynamoDBDocumentClient.from(ddbClient);
export const deleteMovie = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { movieID } = event.pathParameters || {};
    if (!movieID) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'movieID is required' }),
        };
    }
    try {
        
        const deleteParams = {
            TableName: process.env.MOVIES_TABLE, 
            Key: {
                id: movieID, 
            },
        };
       
        await dynamoDB.send(new DeleteCommand(deleteParams));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Movie with ID ${movieID} deleted successfully.` }),
        };
    } catch (error) {
        console.error('Error deleting movie:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to delete movie.' }),
        };
    }
};