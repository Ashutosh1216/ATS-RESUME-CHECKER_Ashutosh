import { NextResponse} from 'next/server'
import { Client } from '@octoai/client' 

// const { Client } = require("@octoai/client")

const client = new Client(process.env.OCTO_CLIENT_TOKEN);

export const POST = async ( req ) => {
  const body = await req.json();
  console.log("body:", body);

const completion = await client.chat.completions.create({
  "model": "meta-llama-3-70b-instruct",
  "messages": [
      {
          "role": "system",
          "content": "The user will upload resumes. Analyse it and format the output wiht good paragraphs and indents",
      },
      {
          "role": "user",
          "content": "tell me the top 3 mistakes in my resume given below\n" + body.text,
      }
  ]        });
  console.log(completion.choices[0].message.content)
  return NextResponse.json({
  success: true,
  message: "Hello, World",
  summary: completion.choices[0].message.content

}
)

 }
