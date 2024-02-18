# Here we demonstrate how we can create a flight status agent that is compatible with DeltaV.

# After running this agent, it can be registered to DeltaV on Agentverse's Services tab. For registration you will have to use the agent's address. 
#
# third party modules used in this example
from pydantic import Field
import requests
from ai_engine import UAgentResponse, UAgentResponseType

class FlightStatusRequest(Model):
    flight_number: str = Field(description="The flight number, for example: BA 222, AA 91, UA 123, AS 1234, WN 832 etc.")
  
    class Config:
        allow_population_by_field_name = True


# Method that send the request to the endpoint which retrieves flight status for the specific flight number
async def get_flight_status(flight_number: str):
    api_key = "your api key here"
    base_url = "https://flight-radar1.p.rapidapi.com/flights/search"
    headers = {
        "X-RapidAPI-Host": "flight-radar1.p.rapidapi.com",
        "X-RapidAPI-Key": api_key,
    }
    querystring = {"query": flight_number}
    response = requests.get(base_url, headers=headers, params=querystring)
    data = response.json()
    results = data["results"]

    schedule = None
    live = None

    for result in results:
        if result["type"] == "schedule":
            schedule = result
        if result["type"] == "live":
            live = result
            
    try:
        if live is not None:
            message = f"{live['label']} is in the air from {live['detail']['schd_from']} to {live['detail']['schd_to']}"
        elif schedule is not None:
            message = f"The flight is scheduled with info {schedule}"
        else:
            message = "We couldn't find information for that flight."
    except Exception as e:
        message = f"Error while retrieving flight information for {flight_number}"
    return message
  

flightradar_protocol = Protocol("FlightStatusProtocol")

# Message handler for data requests sent to this agent
@flightradar_protocol.on_message(model=FlightStatusRequest, replies={UAgentResponse})
async def flightradar_status(ctx: Context, sender: str, msg: FlightStatusRequest):
    ctx.logger.info(f"Received message from {sender}, session: {ctx.session}")
    try:
        flight_number = msg.flight_number
        message = await get_flight_status(flight_number)
        ctx.logger.info(f"message from endpoint: {message}")
        await ctx.send(sender, UAgentResponse(message=message, type=UAgentResponseType.FINAL))
    except Exception as ex:
        ctx.logger.warn(ex)
        await ctx.send(sender, UAgentResponse(message=str(ex), type=UAgentResponseType.ERROR))

agent.include(flightradar_protocol, publish_manifest=True)
