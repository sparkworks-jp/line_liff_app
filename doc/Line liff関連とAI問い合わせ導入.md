# Line公式アカウント機能とリクエスト

|  |  | LINE アカウントだけでニーズを満たせますか | 予想実装方式 |  |
| --- | --- | --- | --- | --- |
| 核心功能 | 网上销售 | ？ | 注文の方，支払方法，ちょっと問題あり |  |
|  | お問い合わせ（AI对话） | ✅ | Webhookで実現 |  |
|  | 会话注文 | ？ |  |  |
|  | 关键词搜索 | ？ |  |  |
|  |  |  |  |  |
| 待定其他功能 | menu | ✅ | [カードタイプメッセージ - LINEキャンパス](https://campus.line.biz/line-official-account/courses/features/lessons/cardtypemessage?utm_source=OAM&utm_medium=tips) | 实现效果参照下图1 |
|  | 注文システム（online）-支付 | ？ | 注文の方，支払方法，ちょっと問題あり |  |
|  | クーポン | ✅ | リッチメニューと自動応答を使って | 
实现效果参照下图1 |
|  | 店铺一览->店铺导航 | ？ | どんな意味ある |  |
|  | 活動页面 | ✅ |  |  |
|  | おすすめ商品のpic-link | ✅ |  |  |
|  |  |  |  |  |

| 公式アカウントの機能 | 説明 | 参照ドキュメント |
| --- | --- | --- |
| お得な情報の配信
（Messaging API） | 允许发送各种类型的消息，包括文本、图片、视频等 | https://developers.line.biz/en/reference/messaging-api/#action-objects
https://developers.line.biz/en/docs/messaging-api/message-types/#image-message |
| クーポンの配布 |  | [LINE 官方客户经理 --- LINE Official Account Manager](https://manager.line.biz/account/@901ccoml/coupon) |
| ショップカード機能 | ご来店1回につき1ポイントを差し上げ、4回目のご来店で特別な特典をご用意しております |  |
| リサーチ機能 | 投票形式やアンケート形式でユーザーの意見を集計できる機能です |  |
| Webhook | 接收用户发送的消息和其他事件通知，**通过这个功能实现AI调用** | [メッセージ（Webhook）を受信する | LINE Developers](https://developers.line.biz/ja/docs/messaging-api/receiving-messages/) |
| 群发消息（Broadcast） | 向所有关注者发送消息
 | [メッセージを送信する | LINE Developers](https://developers.line.biz/ja/docs/messaging-api/sending-messages/) |
| 多人聊天和房间功能 | 在群组和房间中与用户互动 | [群聊和多人聊天 | LINE 开发人员 --- グループトークと複数人トーク | LINE Developers](https://developers.line.biz/ja/docs/messaging-api/group-chats/#receiving-webhook-events) |
| 用户个人资料获取 | 获取用户的基本信息 | [ユーザーのプロフィール情報取得の同意 | LINE Developers](https://developers.line.biz/ja/docs/messaging-api/user-consent/) |
| 模板消息（Template Messages） | 发送预定义结构的交互式消息 | [アクション | LINE Developers](https://developers.line.biz/ja/docs/messaging-api/actions/#clipboard-action) |
| 位置信息服务（Location-based Services） | 基于用户位置提供服务 | [Messaging APIリファレンス | LINE Developers](https://developers.line.biz/ja/reference/messaging-api/#location-action) |
| 快速回复（Quick Reply） | 在消息下方显示快速回复按钮 | [使用快速回复 | LINE 开发人员 --- クイックリプライを使う | LINE Developers](https://developers.line.biz/ja/docs/messaging-api/using-quick-reply/#elements) |
| メンバーシップ | LINE公式アカウント上で利用できる月額課金制の会員機能です。 | [メンバーシップ機能を使う | LINE Developers](https://developers.line.biz/ja/docs/messaging-api/use-membership-features/#get-a-users-membership-subscription-status) |
| チュートリアル - 応答ボット |  | [チュートリアル - 応答ボットを作る | LINE Developers](https://developers.line.biz/ja/docs/messaging-api/nodejs-sample/) |
|  |  |  |
|  |  |  |
| 其他功能：（布局相关） |  |  |
| Flex Messages | 创建自定义布局的消息 | [发送 Flex 消息 | LINE 开发人员 --- Flex Messageを送信する | LINE Developers](https://developers.line.biz/ja/docs/messaging-api/using-flex-messages/) |
| 丰富菜单（Rich Menu） | 自定义图形界面菜单 | [丰富菜单概述 | LINE 开发人员 --- リッチメニューの概要 | LINE Developers](https://developers.line.biz/ja/docs/messaging-api/rich-menus-overview/) |

# LIFF web APP開発に関する注意点

## 注意点

1. フロントエンド，history　routeだけ使えます
2. **LIFFアプリとLIFFアプリ内で開くコンテンツのURLスキームは、httpsである必要**があります
3. user profileについて
    
    まずは，ユーザーの同意なければ，位置情報，カメラへのアクセス，マイクへのアクセス，cookie、localStorage、sessionStorageの使用禁止
    
    ユーザーがLINEアカウントに登録しているプロフィール情報。LINEログインやMessaging APIを使うことで、**ユーザーID・表示名・プロフィール画像・ステータスメッセージ・言語（Messaging APIのみ）・メールアドレス（LINEログインのみ）**を取得できます
    
    一方，LINE Profile+に登録されている情報を、LINEログインやLIFFアプリ、LINEミニアプリで取得してご利用になりたいお客様は、担当営業までご連絡いただくか、[弊社パートナー (opens new window)](https://www.lycbiz.com/jp/partner/sales/)にお問い合わせください。詳しくは、『LINEログイン v2.1 APIリファレンス』の「[ユーザープロフィールを取得する](https://developers.line.biz/ja/reference/line-login/#get-user-profile)」、「[IDトークンを検証する](https://developers.line.biz/ja/reference/line-login/#verify-id-token)」、および『Messaging APIリファレンス』の「[プロフィール情報を取得する](https://developers.line.biz/ja/reference/messaging-api/#get-profile)」を参照してください。
    
    # 
    
4. **LINEプラットフォームへの大量リクエストの禁止**
5. LIFF完全初始化之前，不应该进行任何会改变URL的操作。在 `liff.init()` 返回的Promise解析（resolve）之前，不要改变URL。
6. ユーザーのプロフィールの詳細を、LIFFアプリから自分のサーバーに送信しないでください。

# Line　官方user profile接口如何运用

**user profile 分为两种，一种直接调接口，一种叫LINE Profile+需要向官方申请授权**

[LIFFアプリおよびサーバーでユーザー情報を使用する | LINE Developers](https://developers.line.biz/ja/docs/liff/using-user-profile/)

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/07bde67b-a0c8-4840-9fdd-11a4fb512fc3/0d1036cf-ba97-44b9-ae9e-1f9f7eb8a7c6/image.png)

[LINE Profile+ | LINE Developers](https://developers.line.biz/ja/docs/partner-docs/line-profile-plus/#line-login)

文档主要讲述了**如何通过LINE LIFF应用或LINE登录来获取用户的LINE Profile+信息。**

timestamp(6) without time zone

CURRENT_TIMESTAMP

created_at

updated_at

1. 文件主要内容:
    - 介绍了LINE Profile+服务,它允许获取用户的详细个人信息。
    - 解释了如何在LIFF应用、LINE迷你应用和LINE登录中获取这些信息。
    - 详细说明了**获取信息的步骤**,包括设置作用域、获取ID令牌、解析用户信息等。
    - **列出了可以获取的用户信息类型,如姓名、性别、生日、电话号码和地址**等。
2. 获取用户信息后的应用:
获取用户信息后,应用场景远不止匹配用户订单这么简单。可能的应用包括但不限于:
    - 个性化用户体验: 根据用户信息定制应用界面或内容。
    - 精准营销: 基于用户的年龄、性别、地址等信息进行targeted marketing。
    - 用户验证: 使用电话号码或地址进行身份验证。
    - 数据分析: 收集用户数据以进行市场研究或改善服务。
    - 自动填充: 在需要用户信息的表单中自动填充已知信息。
    - 社交功能: 在应用中实现基于用户真实信息的社交功能。
3. 重要注意事项:
    - 获取这些详细信息需要特殊权限,需要进行申请。
    - 使用这些信息时需要遵守隐私保护相关法规。
    - 不同的信息类型需要不同的作用域(scope)权限。

# Line クーポン

## クーポン種類

LINEが提供しているクーポンは3つあります。

- LINE公式アカウントクーポン
- LINE Pay特典クーポン
- LINEクーポン

それぞれどのような特徴を持っているのかまとめたものが以下の表になります。

|  | **LINE公式アカウントクーポン** | **LINE Pay特典クーポン** | **LINEクーポン** |
| --- | --- | --- | --- |
| 配布方法 | LINE公式アカウントで配布 | LINE Payサービスの特典クーポンとして配布 | LINEクーポンサービス内での配布 |
| 利用方法 | 店頭での提示 | LINE Payでの支払い時に指定 | 店頭での提示 |
| LINE公式アカウントマネージャーでの作成 | 可 | 不可 | 不可 |

LINE Pay特典クーポンや、LINEクーポンはそれぞれ特定のLINEサービス内で利用するものですので、ここではLINE公式アカウントクーポンに絞って調査を進めました。

注意点：　

**LINE公式アカウントのクーポン機能は、POSシステムやECサイトなどの外部データとの直接的な連携ができません**

## クーポンの主要配布方法：

- チラシやDMにクーポンQRコードを掲載
- あいさつメッセージでクーポンを配信
- クーポンをLINEサービスに掲載
    
    

## LINEサービスとは

管理画面の設定で「LINEサービスへの掲載」の項目を「掲載する」にすると、LINE公式アカウントの一覧ページやLINEクーポンなど、LINEの関連サービスにクーポンが表示できるようになります

※LINEの関連サービスへの表示は、「認証済アカウント」が対象となります。

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/07bde67b-a0c8-4840-9fdd-11a4fb512fc3/872c72c0-b520-498c-9b7e-472e4820d7fa/image.png)

# AI問い合わせ導入

AI客服实现流程：

**1.用户在 LINE 公众号中发送消息**

**2.LINE console通过 Webhook 调用 AWS Lambda**，将消息传递给 Lambda 函数。

**3.Lambda 函数处理消息**，**并调用部署的 OpenAI 后端项目。**

**（用ngrok做内网穿透，本地**部署用来测试也可以）

**4.OpenAI 后端项目返回生成的回复
（thread id，assistant id，应该是已经上传好企业文件的assistant和thread  ）**

**5.Lambda 函数将回复发送回 LINE 公众号**，**从而让用户看到 AI 的回复**
（md格式解析，flex message 格式返回消息）

[動態二維碼 - PayPay開放支付API文檔 --- Dynamic QR Code - PayPay Open Payment API Documentation](https://www.paypay.ne.jp/opa/doc/v1.0/dynamicqrcode#tag/Basic-status-transition)

### Private核心代码

lamda:

aws layer 把所有依赖打包上传

```python

import json
import logging
import os
import sys
import requests
import datetime
import markdown
from html import unescape
from bs4 import BeautifulSoup

from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError, LineBotApiError
from linebot.models import MessageEvent, TextMessage, TextSendMessage, FlexSendMessage

# INFOレベル以上のログメッセージを拾うように設定
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# 環境変数からチャネルアクセストークンキー取得
CHANNEL_ACCESS_TOKEN = os.getenv('CHANNEL_ACCESS_TOKEN')
# 環境変数からチャネルシークレットキーを取得
CHANNEL_SECRET = os.getenv('CHANNEL_SECRET')

# それぞれ環境変数に登録されていないとエラー
if CHANNEL_ACCESS_TOKEN is None:
    logger.error(
        'LINE_CHANNEL_ACCESS_TOKEN is not defined as environmental variables.')
    sys.exit(1)
if CHANNEL_SECRET is None:
    logger.error(
        'LINE_CHANNEL_SECRET is not defined as environmental variables.')
    sys.exit(1)

line_bot_api = LineBotApi(CHANNEL_ACCESS_TOKEN)
webhook_handler = WebhookHandler(CHANNEL_SECRET)

@webhook_handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    # 外部API呼び出し
    try:
        
        logger.info(f"Received event.message.text: {event.message.text}")

        current_time = datetime.datetime.now().strftime("%H:%M:%S")

        request_payload = {
            "messages": {
                "role": "User",  
                "text": event.message.text,  
                "time": current_time  
            },
            "thread_id": "01JAPWDVQB06JRZV1K1H95K69V",
            "assistant_id": "01J8KFCES62Q16ZFSAR5RDM2PE"
        }
        logger.info(f"request_payload: {request_payload}")

        response = requests.post(
            "https://b2db-240f-79-1b41-1-c4f9-9ba7-3a5d-a115.ngrok-free.app/chatsline",
            json=request_payload, 
            headers={"Content-Type": "application/json"}
        )
        response.raise_for_status()  
        response_data = response.json()
        # logger.info(f"Received 外部API content: {response.content}")
        logger.info(f"Received 外部API response data: {response_data}")
        api_result = response_data["content"]
        logger.info(f"Received 外部API response.content: {response_data["content"]}")
        
        
        parsed_content = parse_markdown_to_flex(api_result)
        logger.info(f"Parsed content: {parsed_content}")
        
        
        # APIからの応答を使ってメッセージを作成
        flex_message = {
            "type": "carousel",
            "contents": [
                {
                    "type": "bubble",
                    "body": {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "text",
                                "text": parsed_content,  # 取得したデータを表示
                                "wrap": True,  # 确保文本自动换行
                                "size": "md",  # 可选：调整文本大小
                                "maxLines": 0  # 可选：允许无限行，防止被截断
                            }
                        ]
                    }
                }
            ]
        }

        # 応答トークンを使って回答を応答メッセージで送る
        line_bot_api.reply_message(
            event.reply_token, FlexSendMessage(alt_text='Flex Message', contents=flex_message))

    except requests.RequestException as e:
        logger.error(f"Failed to call external API: {e}")
        line_bot_api.reply_message(
            event.reply_token, TextSendMessage(text="Error occurred while calling external API."))

def lambda_handler(event, context):
    logger.info(f"Received event: {json.dumps(event)}")

    # ヘッダーにx-line-signatureがあることを確認
    headers =event['headers']
    logger.info(f'headers:{headers} ')
    if 'x-line-signature' in event['headers']:
        signature = event['headers']['x-line-signature']

    body = event['body']
    # 受け取ったWebhookのJSON
    logger.info(f'request body: {body}')

    try:
        webhook_handler.handle(body, signature)
    except InvalidSignatureError:
        # 署名を検証した結果がLINEプラットフォームからのWebhookでなければ400を返す
        return {
            'statusCode': 400,
            'body': json.dumps('Webhooks are accepted exclusively from the LINE Platform.')
        }
    except LineBotApiError as e:
        # 応答メッセージを送る際LINEプラットフォームからエラーが返ってきた場合
        logger.error('Got exception from LINE Messaging API: %s\n' % e.message)
        for m in e.error.details:
            logger.error('  %s: %s' % (m.property, m.message))

    return {
        'statusCode': 200,
        'body': json.dumps('Success!')
    }
    
    # def parse_markdown_to_flex(text):
    #     html_text = markdown.markdown(text)
        
    #     html_text = html_text.replace("<strong>", "").replace("</strong>", "")
    #     html_text = html_text.replace("<em>", "").replace("</em>", "")
    #     html_text = html_text.replace("<br>", "\n")
    #     html_text = html_text.replace("<p>", "").replace("</p>", "\n")
        
    #     parsed_text = unescape(html_text)
    
    #     return parsed_text
        
    
def parse_markdown_to_flex(text):
    html_text = markdown.markdown(text)
    
    soup = BeautifulSoup(html_text, "html.parser")
    
    parsed_text = soup.get_text("\n")
    
    return unescape(parsed_text)

```

openAI(fast):

```python
@router.post("/chatsline")
# @authorize([RoleName.ADMIN, RoleName.USER])
async def chatsline(
    request: ChatRequest,
    background_tasks: BackgroundTasks, 
    db: AsyncSession = Depends(get_async_db)
) :
    threads = await chat_by_line(
        db,
        request.messages,
        request.thread_id,
        request.assistant_id,
        background_tasks  
    )
    return threads
    
    
    
```

```python
@colored_timing_decorator
async def chat_by_line(
    db: AsyncSession,
    messages: Message,
    thread_id: str,
    assistant_id: str,
    background_tasks: BackgroundTasks
) -> ChatResponse:
    api_key = os.getenv('OPEN_AI_API_KEY_TEST')
    if not api_key:
        raise ValueError("OPEN_AI_API_KEY_TEST environment variable is not set")
    
    client = AsyncOpenAI(api_key=api_key) 
    logging.info(f"------------chat API para:------------ ")
    logging.info(f"messages: {messages}")
    logging.info(f"thread_id: {thread_id}")
    logging.info(f"assistant_id: {assistant_id}")   

    try:

        # トークンチェックとOpenAI Assistant IDの取得
        async with db.begin():
            thirdparty_thread_id = await get_thirdparty_thread_id(db, thread_id)
            logging.info(f"thirdparty_thread_id: {thirdparty_thread_id}")   

            query = select(Assistant.openai_assistant_id).where(Assistant.id == assistant_id)
            result = await db.execute(query)
            openai_assistant_id = result.scalar_one_or_none()
            logging.info(f"openai_assistant_id para: {openai_assistant_id}")   
            if not openai_assistant_id:
                raise HTTPException(status_code=404, detail=f"No openai_assistant_id found with ID: {assistant_id}")

        # OpenAI API 呼び出し
        await client.beta.threads.messages.create(
            thread_id=thirdparty_thread_id,
            role="user",
            content=messages.text
        )

        run = await client.beta.threads.runs.create(
            thread_id=thirdparty_thread_id, 
            assistant_id=openai_assistant_id
        )

        run = await poll_run_status(client, thirdparty_thread_id, run.id)

        if run.status == 'completed':
            message_list = await client.beta.threads.messages.list(thread_id=thirdparty_thread_id)
            assistant_reply = message_list.data[0].content[0].text.value
            token_usage = run.usage.total_tokens if run.usage else 0

            # メインのトランザクション
            async with db.begin():
                
                history_data = {
                    'id': str(ulid.new()),
                    'user_id': "LineTest01",
                    'organization_id': "LineTest01",
                    'assistant_id': assistant_id,
                    'questions': messages.text,
                    'answers': assistant_reply,
                    'token_utilization': token_usage,
                    'thread_id': thread_id,
                    'created_by': "LineTest01",
                    'created_at': datetime.now(),
                    'updated_at': datetime.now(),
                    'updated_by': "LineTest01",
                    'deleted_flag': False
                }

            # バックグラウンドタスクの追加 
            background_tasks.add_task(save_history_with_retry, db, history_data)

            print(f"Assistant's reply: {assistant_reply}")
            return ChatResponse(run=run.model_dump(), content=assistant_reply, status='completed')
        else:
            print(f"Run failed with status: {run.status}")
            return ChatResponse(run=run.model_dump(), status=run.status)
    except TokenLimitExceededException as e:
        raise e
    except Exception as e:
        print(f"Error in chat function: {str(e)}")
        return ChatResponse(run={}, status='error', content=str(e))

    
async def poll_run_status(client: AsyncOpenAI, thread_id: str, run_id: str, max_attempts=100, delay=0.5):
    for _ in range(max_attempts):
        run = await client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run_id)
        if run.status not in ['queued', 'in_progress']:
            return run
        await asyncio.sleep(delay)
    raise TimeoutError("Run status polling timed out")
```