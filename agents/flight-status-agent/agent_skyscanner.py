# Here we demonstrate how we can create a stock price agent that is compatible with DeltaV.

# After running this agent, it can be registered to DeltaV on Agentverse's Services tab. For registration you will have to use the agent's address. 
#
# third party modules used in this example
from pydantic import Field
import requests
from ai_engine import UAgentResponse, UAgentResponseType

# To use this example, you will need to provide an API key for RapidAPI: https://rapidapi.com
# You can define your RAPIDAPI_API_KEY value in the .env file
if RAPIDAPI_API_KEY == "YOUR_RAPIDAPI_API_KEY":
    raise Exception("You need to provide an API key for RapidAPI to use this example")


class StockPriceRequest(Model):
    symbol: str = Field(description="The symbol of the share, for example: AAPL, GOOG, MSFT, etc.")
  
    class Config:
        allow_population_by_field_name = True


# Method that send the request to the endpoint which retrieves stock price for the specific share symbol
async def get_share_price(symbol: str):
    api_key = RAPIDAPI_API_KEY
    base_url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes"
    headers = {
        "X-RapidAPI-Host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
        "X-RapidAPI-Key": api_key,
    }
    querystring = {"symbols": symbol}
    response = requests.get(base_url, headers=headers, params=querystring)
    data = response.json()
    try:
        price = data["quoteResponse"]["result"][0]["regularMarketPrice"]
        message = f"The current share price of {symbol} is {price}"
    except:
        message = f"Failed to retrieve share price for {symbol}"
    return message
  

yahoo_protocol = Protocol("StockPriceProtocol")

# Message handler for data requests sent to this agent
@yahoo_protocol.on_message(model=StockPriceRequest, replies={UAgentResponse})
async def yahoo_share(ctx: Context, sender: str, msg: StockPriceRequest):
    ctx.logger.info(f"Received message from {sender}, session: {ctx.session}")
    try:
        symbol = msg.symbol
        message = await get_share_price(symbol)
        ctx.logger.info(f"message from endpoint: {message}")
        await ctx.send(sender, UAgentResponse(message=message, type=UAgentResponseType.FINAL))
    except Exception as ex:
        ctx.logger.warn(ex)
        await ctx.send(sender, UAgentResponse(message=str(ex), type=UAgentResponseType.ERROR))

agent.include(yahoo_protocol, publish_manifest=True)
