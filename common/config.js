module.exports = {
   listenPort : 3001,
   weather : {
      key : "6c4662505073736237334476415a79"
      , prevUrl : "http://openapi.seoul.go.kr:8088"
      , postUrl : "xml/RealtimeWeatherStation"
   }
   , traffic : {
      key : "644f6544667373623130335468575a71"
      , prevUrl : "http://openapi.seoul.go.kr:8088"
      , postUrl : "xml/VolInfo"
   }
   , station : {
      key : "j%2FJEhMLcNed%2Be%2FNrouvABdyi%2B7xNmrvmm8gJh14R1EItc4ahLDZ5S%2FMv4AzERf8bgxImWinbd%2F4sf3evR97VJA%3D%3D"
      , url : "http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid"
   }
};