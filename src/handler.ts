const config = {
  ChannelSecret: 'ChannelSecret',
  ChannelAccessToken: 'ChannelAccessToken'
}

export async function handleRequest(request: Request): Promise<Response> {
  const method: string = request.method
  const url: URL = new URL(request.url)
  const pathname: string = url.pathname

  if (method == 'POST' && pathname == '/callback') {
    let signature = request.headers.get('X-Line-Signature')

    // null check.
    if (!signature) {
      return new Response('Failed to get signature!', { status: 400 })
    } else {
      messageHandler(config, signature, await request.text())
      return new Response('OK', { status: 200 })
    }
  }

  return new Response('啊喔', { status: 404 })
}

async function messageHandler(config: any, signature: string, requestBody: string) {
  const event = JSON.parse(requestBody)['events'][0]
  const replyToken = event['replyToken']
  const url = 'https://api.line.me/v2/bot/message/reply'

  if (event['type'] == 'message') {
      let headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config['ChannelAccessToken']}`
      }

      let postData = {
          "replyToken": replyToken,
          "messages": [
              {
                  "type": "text",
                  "text": event['message']['text']
              },
          ]
      }

      let requestOption = {
          'method': 'POST',
          'headers': headers,
          'body': JSON.stringify(postData)
      }

      fetch(url, requestOption)
  }
}