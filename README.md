# 前序
史上最强的币圈机器人在众多 Builder 的拥护下诞生了！虽然它目前还是个baby，但我们已经为它构建了非常强大的内容抓取基础设施和指令集。目前可以使用的功能非常多，让我们来看看如何使用！

<img src="https://uploader.shimo.im/f/HRYCbilKAVDDUMn4.png!thumbnail?accessToken=eyJhbGciOiJIUzI1NiIsImtpZCI6ImRlZmF1bHQiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE2NTk2MDU2NTcsImZpbGVHVUlEIjoiMndBbFhkeDg4WXV3ODRBUCIsImlhdCI6MTY1OTYwNTM1NywiaXNzIjoidXBsb2FkZXJfYWNjZXNzX3Jlc291cmNlIiwidXNlcklkIjoxODQ5MjE2OX0._DnmT9kj-HbMxrvtQVr3OTfyw76xWcToggt6Azrej-8" alt="drawing" width = "450">

# 💹币价查询

币价查询是一个较为基础的功能，您可以使用 // 加上任意币种 来实现（例如：//BTC），机器人会将币种价格以及K线图一并发送。（默认图表为15分钟K线，如果您想查看其他时间的图表，可以输入指令【/chart 币种 时间】（例如：/chart btc 30min 或者 /chart btc 1h）

<img src="https://uploader.shimo.im/f/Hyk34L8LBCSMYF8n.png!thumbnail?accessToken=eyJhbGciOiJIUzI1NiIsImtpZCI6ImRlZmF1bHQiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE2NTk2MDU2NTcsImZpbGVHVUlEIjoiMndBbFhkeDg4WXV3ODRBUCIsImlhdCI6MTY1OTYwNTM1NywiaXNzIjoidXBsb2FkZXJfYWNjZXNzX3Jlc291cmNlIiwidXNlcklkIjoxODQ5MjE2OX0._DnmT9kj-HbMxrvtQVr3OTfyw76xWcToggt6Azrej-8" alt="drawing" width = "350">


如果您查询的币种有多个相同，机器人会询问您想查询哪一个,接着输入 【//币种 编号】即可（例如 //fort 1），熟悉以后，每次查询都可直接输入 //fort 1 而不需要等待机器人询问。

<img src="https://uploader.shimo.im/f/ZyrFIMszVyiAKMT6.png!thumbnail?accessToken=eyJhbGciOiJIUzI1NiIsImtpZCI6ImRlZmF1bHQiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE2NTk2MDU2NTcsImZpbGVHVUlEIjoiMndBbFhkeDg4WXV3ODRBUCIsImlhdCI6MTY1OTYwNTM1NywiaXNzIjoidXBsb2FkZXJfYWNjZXNzX3Jlc291cmNlIiwidXNlcklkIjoxODQ5MjE2OX0._DnmT9kj-HbMxrvtQVr3OTfyw76xWcToggt6Azrej-8" alt="drawing" width = "350">


# 👁‍🗨币种消息监控

如您希望快速监控某个币种的消息（包括该币种的的官方公告新闻），只需要在群内输入 【/watch 币种名 监控】（例如： /watch btc 监控）【注意：该功能为了避免群友乱发指令监控太多币种导致刷屏，只有机器人的邀请者和群主管理员才可以使用】

<img src="https://uploader.shimo.im/f/pBze1PinNnQGo9VJ.png!thumbnail?accessToken=eyJhbGciOiJIUzI1NiIsImtpZCI6ImRlZmF1bHQiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE2NTk2MDU2NTcsImZpbGVHVUlEIjoiMndBbFhkeDg4WXV3ODRBUCIsImlhdCI6MTY1OTYwNTM1NywiaXNzIjoidXBsb2FkZXJfYWNjZXNzX3Jlc291cmNlIiwidXNlcklkIjoxODQ5MjE2OX0._DnmT9kj-HbMxrvtQVr3OTfyw76xWcToggt6Azrej-8" alt="drawing" width = "350">

如果您想监控的币种暂未被录入，您可以通过提交表单 https://jinshuju.net/f/DgW3f9 快速申请，我们将第一时间为您添加该币种监控。
 
 
# ⏬币种消息监控列表

有时您可能会忘记已经添加了哪些监控，不用担心。使用【/watch list 】命令可以快速浏览目前群内已经监控了哪些币种。 

 <img src="https://uploader.shimo.im/f/x1QaVs26PBRTyYMt.png!thumbnail?accessToken=eyJhbGciOiJIUzI1NiIsImtpZCI6ImRlZmF1bHQiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE2NTk2MDU2NTcsImZpbGVHVUlEIjoiMndBbFhkeDg4WXV3ODRBUCIsImlhdCI6MTY1OTYwNTM1NywiaXNzIjoidXBsb2FkZXJfYWNjZXNzX3Jlc291cmNlIiwidXNlcklkIjoxODQ5MjE2OX0._DnmT9kj-HbMxrvtQVr3OTfyw76xWcToggt6Azrej-8" alt="drawing" width = "350">
 
# ❌取消币种消息监控

如您觉得监控太多导致消息过于频繁想要取消一些监控，可以使用【/watch rm 币种名】的命令取消该币种的监控（例如：/watch rm btc），如果您希望一次性移除所有监控可以使用【/watch rm all】命令。

<img src="https://uploader.shimo.im/f/16iypXj0asyWqgRS.png!thumbnail?accessToken=eyJhbGciOiJIUzI1NiIsImtpZCI6ImRlZmF1bHQiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE2NTk2MDU2NTcsImZpbGVHVUlEIjoiMndBbFhkeDg4WXV3ODRBUCIsImlhdCI6MTY1OTYwNTM1NywiaXNzIjoidXBsb2FkZXJfYWNjZXNzX3Jlc291cmNlIiwidXNlcklkIjoxODQ5MjE2OX0._DnmT9kj-HbMxrvtQVr3OTfyw76xWcToggt6Azrej-8" alt="drawing" width = "350">

# ☣️超级定制化监控

如果您觉得以上提供的快速监控不够给力，想要自己进行个性化定制监控，没问题！我们提供了一整套定制化服务系统，您可以通过查看这个教程：     ，实现您的全定制化监控。通过本系统，您可以从twitter、discord、以及各种新闻媒体处定制监控您想要的内容，不错过任何一条高质量信息。

<img src="https://uploader.shimo.im/f/vQEcp6sVnwiW0zzi.png!thumbnail?accessToken=eyJhbGciOiJIUzI1NiIsImtpZCI6ImRlZmF1bHQiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE2NTk2MDU2NTcsImZpbGVHVUlEIjoiMndBbFhkeDg4WXV3ODRBUCIsImlhdCI6MTY1OTYwNTM1NywiaXNzIjoidXBsb2FkZXJfYWNjZXNzX3Jlc291cmNlIiwidXNlcklkIjoxODQ5MjE2OX0._DnmT9kj-HbMxrvtQVr3OTfyw76xWcToggt6Azrej-8" alt="drawing" width = "350">
