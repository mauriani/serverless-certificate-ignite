import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamondbClient";

interface ICreateCertificatre {
  id: string;
  name: string;
  grade: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id, name, grade } = JSON.parse(event.body) as ICreateCertificatre;

  await document
    .put({
      TableName: "users_certificate",
      Item: {
        id,
        name,
        grade,
        create_at: new Date(),
      },
    })
    .promise();

  // busca o elemento onde meu id seja igual a id
  const response = await document
    .query({
      TableName: "users_certificate",
      KeyConditionExpression: "id=:id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(response.Items[0]),
  };
};
