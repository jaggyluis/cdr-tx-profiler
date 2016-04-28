var aircraft = [
    {
        "IATA": "100",
        "ICAO": "F100",
        "name ": "Fokker 100",
        "wake": "M",
        "code": "C",
        "seats": 97
    },
    {
        "IATA": "141",
        "ICAO": "B461",
        "name ": "BAe 146-100 Pax",
        "wake": "M",
        "code": "C",
        "seats": 82
    },
    {
        "IATA": "142",
        "ICAO": "B462",
        "name ": "BAe 146-200 Pax",
        "wake": "M",
        "code": "C",
        "seats": 100
    },
    {
        "IATA": "143",
        "ICAO": "B463",
        "name ": "BAe 146-300 Pax",
        "wake": "M",
        "code": "C",
        "seats": 112
    },
    {
        "IATA": "146",
        "ICAO": "",
        "name ": "BAe 146 all pax models",
        "wake": "M",
        "code": "C",
        "seats": 100
    },
    {
        "IATA": "14F",
        "ICAO": "",
        "name ": "BAe 146 Freighter (-100/200/300QT & QC)",
        "wake": "M",
        "code": "C",
        "seats": 0
    },
    {
        "IATA": "14X",
        "ICAO": "B461",
        "name ": "BAe 146 Freighter (-100QT & QC)",
        "wake": "M",
        "code": "C",
        "seats": 0
    },
    {
        "IATA": "14Y",
        "ICAO": "B462",
        "name ": "BAe 146 Freighter (-200QT & QC)",
        "wake": "M",
        "code": "C",
        "seats": 0
    },
    {
        "IATA": "14Z",
        "ICAO": "B463",
        "name ": "BAe 146 Freighter (-200QT & QC)",
        "wake": "M",
        "code": "C",
        "seats": 0
    },
    {
        "IATA": "310",
        "ICAO": "A310",
        "name ": "Airbus A310 all pax models",
        "wake": "H",
        "code": "D",
        "seats": 243
    },
    {
        "IATA": "312",
        "ICAO": "A310",
        "name ": "Airbus A310-200 pax",
        "wake": "H",
        "code": "D",
        "seats": 243
    },
    {
        "IATA": "313",
        "ICAO": "A310",
        "name ": "Airbus A310-300 pax",
        "wake": "H",
        "code": "D",
        "seats": 243
    },
    {
        "IATA": "318",
        "ICAO": "A318",
        "name ": "Airbus A318",
        "wake": "M",
        "code": "C",
        "seats": 124
    },
    {
        "IATA": "319",
        "ICAO": "A319",
        "name ": "Airbus A319",
        "wake": "M",
        "code": "C",
        "seats": 116
    },
    {
        "IATA": "31F",
        "ICAO": "A310",
        "name ": "Airbus A310 Freighter",
        "wake": "M",
        "code": "D",
        "seats": 0
    },
    {
        "IATA": "31X",
        "ICAO": "A310",
        "name ": "Airbus A310-200 Freighter",
        "wake": "M",
        "code": "D",
        "seats": 0
    },
    {
        "IATA": "31Y",
        "ICAO": "A310",
        "name ": "Airbus A310-300 Freighter",
        "wake": "M",
        "code": "D",
        "seats": 0
    },
    {
        "IATA": "320",
        "ICAO": "A320",
        "name ": "Airbus A320-100/200",
        "wake": "M",
        "code": "C",
        "seats": 140
    },
    {
        "IATA": "321",
        "ICAO": "A321",
        "name ": "Airbus A321-100/200",
        "wake": "M",
        "code": "C",
        "seats": 149
    },
    {
        "IATA": "32S",
        "ICAO": "n/a",
        "name ": "Airbus A318/319/320/321",
        "wake": "M",
        "code": "C",
        "seats": 164
    },
    {
        "IATA": "330",
        "ICAO": "A330",
        "name ": "Airbus A330 all models",
        "wake": "H",
        "code": "E",
        "seats": 0
    },
    {
        "IATA": "332",
        "ICAO": "A332",
        "name ": "Airbus A330-200",
        "wake": "H",
        "code": "E",
        "seats": 250
    },
    {
        "IATA": "333",
        "ICAO": "A333",
        "name ": "Airbus A330-300",
        "wake": "H",
        "code": "E",
        "seats": 300
    },
    {
        "IATA": "340",
        "ICAO": "A340",
        "name ": "Airbus A340 all models",
        "wake": "H",
        "code": "E",
        "seats": 0
    },
    {
        "IATA": "342",
        "ICAO": "A342",
        "name ": "Airbus A340-200",
        "wake": "H",
        "code": "E",
        "seats": 303
    },
    {
        "IATA": "343",
        "ICAO": "A343",
        "name ": "Airbus A340-300",
        "wake": "H",
        "code": "E",
        "seats": 221
    },
    {
        "IATA": "345",
        "ICAO": "A345",
        "name ": "Airbus A340-500",
        "wake": "H",
        "code": "E",
        "seats": 225
    },
    {
        "IATA": "346",
        "ICAO": "A346",
        "name ": "Airbus A340-600",
        "wake": "H",
        "code": "E",
        "seats": 380
    },
    {
        "IATA": "350",
        "ICAO": "A350",
        "name ": "Airbus A350 all models",
        "wake": "H",
        "code": "E",
        "seats": 0
    },
    {
        "IATA": "351",
        "ICAO": "A35K",
        "name ": "Airbus A350-1000",
        "wake": "H",
        "code": "E",
        "seats": 366
    },
    {
        "IATA": "359",
        "ICAO": "A359",
        "name ": "Airbus A350-900",
        "wake": "H",
        "code": "E",
        "seats": 315
    },
    {
        "IATA": "380",
        "ICAO": "A380",
        "name ": "Airbus A380 pax",
        "wake": "H",
        "code": "F",
        "seats": 450
    },
    {
        "IATA": "38F",
        "ICAO": "A38F",
        "name ": "Airbus A380 Freighter",
        "wake": "H",
        "code": "F",
        "seats": 0
    },
    {
        "IATA": "703",
        "ICAO": "B703",
        "name ": "Boeing 707-300 pax",
        "wake": "H",
        "code": "D",
        "seats": 147
    },
    {
        "IATA": "707",
        "ICAO": "n/a",
        "name ": "Boeing 707/720 all pax models",
        "wake": "H",
        "code": "D",
        "seats": 140
    },
    {
        "IATA": "70F",
        "ICAO": "B703",
        "name ": "Boeing 707 Freighter",
        "wake": "H",
        "code": "D",
        "seats": 0
    },
    {
        "IATA": "70M",
        "ICAO": "B703",
        "name ": "Boeing 707 Combi",
        "wake": "H",
        "code": "D",
        "seats": 50
    },
    {
        "IATA": "717",
        "ICAO": "B712",
        "name ": "Boeing 717",
        "wake": "M",
        "code": "C",
        "seats": 115
    },
    {
        "IATA": "721",
        "ICAO": "B721",
        "name ": "Boeing 727-100 pax",
        "wake": "M",
        "code": "C",
        "seats": 150
    },
    {
        "IATA": "722",
        "ICAO": "B722",
        "name ": "Boeing 727-200 pax",
        "wake": "M",
        "code": "C",
        "seats": 150
    },
    {
        "IATA": "727",
        "ICAO": "n/a",
        "name ": "Boeing 727 all pax models",
        "wake": "M",
        "code": "C",
        "seats": 150
    },
    {
        "IATA": "72B",
        "ICAO": "B721",
        "name ": "Boeing 727-100 Mixed Configuration",
        "wake": "M",
        "code": "C",
        "seats": 75
    },
    {
        "IATA": "72C",
        "ICAO": "B722",
        "name ": "Boeing 727-200 Mixed Configuration",
        "wake": "M",
        "code": "C",
        "seats": 75
    },
    {
        "IATA": "72F",
        "ICAO": "n/a",
        "name ": "Boeing 727 Freighter (-100/200)",
        "wake": "M",
        "code": "C",
        "seats": 0
    },
    {
        "IATA": "72M",
        "ICAO": "n/a",
        "name ": "Boeing 727 Combi",
        "wake": "M",
        "code": "C",
        "seats": 75
    },
    {
        "IATA": "72S",
        "ICAO": "B722",
        "name ": "Boeing 727-200 Advanced pax",
        "wake": "M",
        "code": "C",
        "seats": 150
    },
    {
        "IATA": "72X",
        "ICAO": "B721",
        "name ": "Boeing 727-100 Freighter",
        "wake": "M",
        "code": "C",
        "seats": 0
    },
    {
        "IATA": "72Y",
        "ICAO": "B722",
        "name ": "Boeing 727-200 Freighter",
        "wake": "M",
        "code": "C",
        "seats": 0
    },
    {
        "IATA": "731",
        "ICAO": "B731",
        "name ": "Boeing 737-100 pax",
        "wake": "M",
        "code": "C",
        "seats": 134
    },
    {
        "IATA": "732",
        "ICAO": "B732",
        "name ": "Boeing 737-200 pax",
        "wake": "M",
        "code": "C",
        "seats": 134
    },
    {
        "IATA": "733",
        "ICAO": "B733",
        "name ": "Boeing 737-300 pax",
        "wake": "M",
        "code": "C",
        "seats": 128
    },
    {
        "IATA": "734",
        "ICAO": "B734",
        "name ": "Boeing 737-400 pax",
        "wake": "M",
        "code": "C",
        "seats": 159
    },
    {
        "IATA": "735",
        "ICAO": "B735",
        "name ": "Boeing 737-500 pax",
        "wake": "M",
        "code": "C",
        "seats": 100
    },
    {
        "IATA": "736",
        "ICAO": "B736",
        "name ": "Boeing 737-600 pax",
        "wake": "M",
        "code": "C",
        "seats": 130
    },
    {
        "IATA": "737",
        "ICAO": "n/a",
        "name ": "Boeing 737 all pax models",
        "wake": "M",
        "code": "C",
        "seats": 165
    },
    {
        "IATA": "738",
        "ICAO": "B738",
        "name ": "Boeing 737-800 pax",
        "wake": "M",
        "code": "C",
        "seats": 168
    },
    {
        "IATA": "739",
        "ICAO": "B739",
        "name ": "Boeing 737-900 pax",
        "wake": "M",
        "code": "C",
        "seats": 204
    },
    {
        "IATA": "73F",
        "ICAO": "n/a",
        "name ": "Boeing 737 all Freighter models",
        "wake": "M",
        "code": "C",
        "seats": 0
    },
    {
        "IATA": "73G",
        "ICAO": "B737",
        "name ": "Boeing 737-700 pax",
        "wake": "M",
        "code": "C",
        "seats": 128
    },
    {
        "IATA": "73H",
        "ICAO": "B738",
        "name ": "Boeing 737-800 (winglets) pax",
        "wake": "M",
        "code": "C",
        "seats": 168
    },
    {
        "IATA": "73M",
        "ICAO": "B732",
        "name ": "Boeing 737-200 Combi",
        "wake": "M",
        "code": "C",
        "seats": 75
    },
    {
        "IATA": "73W",
        "ICAO": "B737",
        "name ": "Boeing 737-700 (winglets) pax",
        "wake": "M",
        "code": "C",
        "seats": 148
    },
    {
        "IATA": "73X",
        "ICAO": "B732",
        "name ": "Boeing 737-200 Freighter",
        "wake": "M",
        "code": "C",
        "seats": 0
    },
    {
        "IATA": "73Y",
        "ICAO": "B733",
        "name ": "Boeing 737-300 Freighter",
        "wake": "M",
        "code": "C",
        "seats": 0
    },
    {
        "IATA": "741",
        "ICAO": "B741",
        "name ": "Boeing 747-100 pax",
        "wake": "H",
        "code": "E",
        "seats": 400
    },
    {
        "IATA": "742",
        "ICAO": "B742",
        "name ": "Boeing 747-200 pax",
        "wake": "H",
        "code": "E",
        "seats": 400
    },
    {
        "IATA": "743",
        "ICAO": "B743",
        "name ": "Boeing 747-300 pax",
        "wake": "H",
        "code": "E",
        "seats": 400
    },
    {
        "IATA": "744",
        "ICAO": "B744",
        "name ": "Boeing 747-400 pax",
        "wake": "H",
        "code": "E",
        "seats": 420
    },
    {
        "IATA": "747",
        "ICAO": "n/a",
        "name ": "Boeing 747 all pax models",
        "wake": "H",
        "code": "E",
        "seats": 420
    },
    {
        "IATA": "74C",
        "ICAO": "B742",
        "name ": "Boeing 747-200 Combi",
        "wake": "H",
        "code": "E",
        "seats": 200
    },
    {
        "IATA": "74D",
        "ICAO": "B743",
        "name ": "Boeing 747-300 Combi",
        "wake": "H",
        "code": "E",
        "seats": 200
    },
    {
        "IATA": "74E",
        "ICAO": "B744",
        "name ": "Boeing 747-400 Combi",
        "wake": "H",
        "code": "E",
        "seats": 410
    },
    {
        "IATA": "74F",
        "ICAO": "n/a",
        "name ": "Boeing 747 all Freighter models",
        "wake": "H",
        "code": "E",
        "seats": 0
    },
    {
        "IATA": "74J",
        "ICAO": "B744",
        "name ": "Boeing 747-400 (Domestic) pax",
        "wake": "H",
        "code": "E",
        "seats": 500
    },
    {
        "IATA": "74L",
        "ICAO": "N74S",
        "name ": "Boeing 747SP",
        "wake": "H",
        "code": "E",
        "seats": 400
    },
    {
        "IATA": "74M",
        "ICAO": "n/a",
        "name ": "Boeing 747 all Combi models",
        "wake": "H",
        "code": "E",
        "seats": 200
    },
    {
        "IATA": "74R",
        "ICAO": "B74R",
        "name ": "Boeing 747SR pax",
        "wake": "H",
        "code": "E",
        "seats": 400
    },
    {
        "IATA": "74T",
        "ICAO": "B741",
        "name ": "Boeing 747-100 Freighter",
        "wake": "H",
        "code": "E",
        "seats": 0
    },
    {
        "IATA": "74U",
        "ICAO": "B743",
        "name ": "Boeing 747-300 / 747-200 SUD Freighter",
        "wake": "H",
        "code": "E",
        "seats": 0
    },
    {
        "IATA": "74V",
        "ICAO": "B74R",
        "name ": "Boeing 747SR Freighter",
        "wake": "H",
        "code": "E",
        "seats": 0
    },
    {
        "IATA": "74X",
        "ICAO": "B742",
        "name ": "Boeing 747-200 Freighter",
        "wake": "H",
        "code": "E",
        "seats": 0
    },
    {
        "IATA": "74Y",
        "ICAO": "B744",
        "name ": "Boeing 747-400 Freighter",
        "wake": "H",
        "code": "E",
        "seats": 0
    },
    {
        "IATA": "752",
        "ICAO": "B752",
        "name ": "Boeing 757-200 pax",
        "wake": "H",
        "code": "D",
        "seats": 220
    },
    {
        "IATA": "753",
        "ICAO": "B753",
        "name ": "Boeing 757-300 pax",
        "wake": "H",
        "code": "D",
        "seats": 287
    },
    {
        "IATA": "757",
        "ICAO": "n/a",
        "name ": "Boeing 757 all pax models",
        "wake": "H",
        "code": "D",
        "seats": 178
    },
    {
        "IATA": "75F",
        "ICAO": "B752",
        "name ": "Boeing 757 Freighter",
        "wake": "H",
        "code": "D",
        "seats": 0
    },
    {
        "IATA": "75M",
        "ICAO": "B752",
        "name ": "Boeing 757 Mixed Configuration",
        "wake": "H",
        "code": "D",
        "seats": 110
    },
    {
        "IATA": "762",
        "ICAO": "B762",
        "name ": "Boeing 767-200 pax",
        "wake": "H",
        "code": "D",
        "seats": 210
    },
    {
        "IATA": "763",
        "ICAO": "B763",
        "name ": "Boeing 767-300 pax",
        "wake": "H",
        "code": "D",
        "seats": 229
    },
    {
        "IATA": "764",
        "ICAO": "B764",
        "name ": "Boeing 767-400 pax",
        "wake": "H",
        "code": "D",
        "seats": 260
    },
    {
        "IATA": "767",
        "ICAO": "n/a",
        "name ": "Boeing 767 all pax models",
        "wake": "H",
        "code": "D",
        "seats": 229
    },
    {
        "IATA": "76F",
        "ICAO": "n/a",
        "name ": "Boeing 767 all Freighter models",
        "wake": "H",
        "code": "D",
        "seats": 0
    },
    {
        "IATA": "76X",
        "ICAO": "B762",
        "name ": "Boeing 767-200 Freighter",
        "wake": "H",
        "code": "D",
        "seats": 0
    },
    {
        "IATA": "76Y",
        "ICAO": "B763",
        "name ": "Boeing 767-300 Freighter",
        "wake": "H",
        "code": "D",
        "seats": 0
    },
    {
        "IATA": "772",
        "ICAO": "B772",
        "name ": "Boeing 777-200 pax",
        "wake": "H",
        "code": "E",
        "seats": 275
    },
    {
        "IATA": "773",
        "ICAO": "B773",
        "name ": "Boeing 777-300 pax",
        "wake": "H",
        "code": "E",
        "seats": 368
    },
    {
        "IATA": "777",
        "ICAO": "n/a",
        "name ": "Boeing 777 all pax models",
        "wake": "H",
        "code": "E",
        "seats": 330
    },
    {
        "IATA": "77L",
        "ICAO": "B77L",
        "name ": "Boeing 777-200LR pax",
        "wake": "H",
        "code": "E",
        "seats": 275
    },
    {
        "IATA": "77w",
        "ICAO": "B77W",
        "name ": "Boeing 777-300ER pax",
        "wake": "H",
        "code": "E",
        "seats": 368
    },
    {
        "IATA": "783",
        "ICAO": "B783",
        "name ": "Boeing 787-300 pax",
        "wake": "H",
        "code": "E",
        "seats": 0
    },
    {
        "IATA": "788",
        "ICAO": "B788",
        "name ": "Boeing 787-800 pax",
        "wake": "H",
        "code": "E",
        "seats": 250
    },
    {
        "IATA": "789",
        "ICAO": "B789",
        "name ": "Boeing 787-900 pax",
        "wake": "H",
        "code": "E",
        "seats": 300
    },
    {
        "IATA": "A26",
        "ICAO": "AN26",
        "name ": "Antonov AN-26",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "A28",
        "ICAO": "AN28",
        "name ": "Antonov AN-28 / PZL Miele M-28 Skytruck",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "A30",
        "ICAO": "AN30",
        "name ": "Antonov AN-30",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "A32",
        "ICAO": "AN32",
        "name ": "Antonov AN-32",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "A40",
        "ICAO": "A140",
        "name ": "Antonov AN-140",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "A4F",
        "ICAO": "A124",
        "name ": "Antonov AN-124 Ruslan",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "AB3",
        "ICAO": "A30B",
        "name ": "Airbus Industrie A300 pax",
        "wake": "H",
        "code": "D",
        "seats": null
    },
    {
        "IATA": "AB4",
        "ICAO": "A30B",
        "name ": "Airbus Industrie A300B2/B4/C4 pax",
        "wake": "H",
        "code": "D",
        "seats": null
    },
    {
        "IATA": "AB6",
        "ICAO": "A306",
        "name ": "Airbus Industrie A300-600 pax",
        "wake": "H",
        "code": "D",
        "seats": null
    },
    {
        "IATA": "ABB",
        "ICAO": "A3ST",
        "name ": "Airbus Industrie A300-600ST Beluga Freighter",
        "wake": "H",
        "code": "D",
        "seats": null
    },
    {
        "IATA": "ABF",
        "ICAO": "A30B",
        "name ": "Airbus Industrie A300 Freighter",
        "wake": "H",
        "code": "D",
        "seats": null
    },
    {
        "IATA": "ABX",
        "ICAO": "A30B",
        "name ": "Airbus Industrie A300C4/F4 Freighter",
        "wake": "H",
        "code": "D",
        "seats": null
    },
    {
        "IATA": "ABY",
        "ICAO": "A306",
        "name ": "Airbus Industrie A300-600 Freighter",
        "wake": "H",
        "code": "D",
        "seats": null
    },
    {
        "IATA": "ACD",
        "ICAO": "n/a",
        "name ": "Gulfstream/Rockwell (Aero) Commander/Turbo Commander",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "ACP",
        "ICAO": "AC68",
        "name ": "Gulfstream/Rockwell (Aero) Commander",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "ACT",
        "ICAO": "AC90",
        "name ": "Gulfstream/Rockwell (Aero) Turbo Commander",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "ALM",
        "ICAO": "LOAD",
        "name ": "Ayres LM-200 Loadmaster",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "AN4",
        "ICAO": "AN24",
        "name ": "Antonov AN-24",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "AN6",
        "ICAO": "n/a",
        "name ": "Antonov AN-26 / AN-30 /AN-32",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "AN7",
        "ICAO": "AN72",
        "name ": "Antonov AN-72 / AN-74",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "ANF",
        "ICAO": "AN12",
        "name ": "Antonov AN-12 Freighter",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "APH",
        "ICAO": "n/a",
        "name ": "Eurocopter (Aerospatiale) SA330 Puma / AS332 Super Puma",
        "wake": "n/a",
        "code": "",
        "seats": null
    },
    {
        "IATA": "AR1",
        "ICAO": "RJ1H",
        "name ": "Avro RJ100 Avroliner",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "AR7",
        "ICAO": "RJ70",
        "name ": "Avro RJ70 Avroliner",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "AR8",
        "ICAO": "RJ85",
        "name ": "Avro RJ85 Avroliner",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "ARJ",
        "ICAO": "n/a",
        "name ": "Avro RJ70 / RJ85 / RJ100 Avroliner",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "ARX",
        "ICAO": "n/a",
        "name ": "Avro RJX85 / RJX100",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "AT4",
        "ICAO": "AT43",
        "name ": "Aerospatiale/Alenia ATR 42-300 / 320",
        "wake": "M",
        "code": "C",
        "seats": 42
    },
    {
        "IATA": "AT5",
        "ICAO": "AT45",
        "name ": "Aerospatiale/Alenia ATR 42-500",
        "wake": "M",
        "code": "C",
        "seats": 42
    },
    {
        "IATA": "AT7",
        "ICAO": "AT72",
        "name ": "Aerospatiale/Alenia ATR 72",
        "wake": "M",
        "code": "C",
        "seats": 68
    },
    {
        "IATA": "ATP",
        "ICAO": "ATP",
        "name ": "British Aerospace ATP",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "ATR",
        "ICAO": "n/a",
        "name ": "Aerospatiale/Alenia ATR 42/ ATR 72",
        "wake": "M",
        "code": "C",
        "seats": 69
    },
    {
        "IATA": "AX1",
        "ICAO": "RX1H",
        "name ": "Avro RJX100",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "AX8",
        "ICAO": "RX85",
        "name ": "Avro RJX85",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "B11",
        "ICAO": "BA11",
        "name ": "British Aerospace (BAC) One Eleven / RomBAC One Eleven",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "B12",
        "ICAO": "BA11",
        "name ": "British Aerospace (BAC) One Eleven 200",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "B13",
        "ICAO": "BA11",
        "name ": "British Aerospace (BAC) One Eleven 300",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "B14",
        "ICAO": "BA11",
        "name ": "British Aerospace (BAC) One Eleven 400/475",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "B15",
        "ICAO": "BA11",
        "name ": "British Aerospace (BAC) One Eleven 500 / RomBAC One Eleven",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "B72",
        "ICAO": "B720",
        "name ": "Boeing 720B pax",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "BE1",
        "ICAO": "B190",
        "name ": "Beechcraft 1900/1900C/1900D",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "BE2",
        "ICAO": "n/a",
        "name ": "Beechcraft twin piston engines",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "BEC",
        "ICAO": "n/a",
        "name ": "Beechcraft light aircraft",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "BEH",
        "ICAO": "B190",
        "name ": "Beechcraft 1900D",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "BEP",
        "ICAO": "n/a",
        "name ": "Beechcraft light aircraft - single engine",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "BES",
        "ICAO": "B190",
        "name ": "Beechcfrat 1900/1900C",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "BET",
        "ICAO": "n/a",
        "name ": "Beechcraft light aircraft - twin turboprop engine",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "BH2",
        "ICAO": "n/a",
        "name ": "Bell Helicopters",
        "wake": "n/a",
        "code": "",
        "seats": null
    },
    {
        "IATA": "BNI",
        "ICAO": "BN2P",
        "name ": "Pilatus Britten-Norman BN-2A/B Islander",
        "wake": "L",
        "code": "A",
        "seats": 9
    },
    {
        "IATA": "BNT",
        "ICAO": "TRIS",
        "name ": "Pilatus Britten-Norman BN-2A Mk III Trislander",
        "wake": "L",
        "code": "B",
        "seats": 16
    },
    {
        "IATA": "BUS",
        "ICAO": "n/a",
        "name ": "Bus",
        "wake": "n/a",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CCJ",
        "ICAO": "CL60",
        "name ": "Canadair Challenger",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CCX",
        "ICAO": "GLEX",
        "name ": "Canadair Global Express",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CD2",
        "ICAO": "NOMA",
        "name ": "Government Aircraft Factories N22B / N24A Nomad",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CL4",
        "ICAO": "CL44",
        "name ": "Canadair CL-44",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CN1",
        "ICAO": "n/a",
        "name ": "Cessna light aircraft - single piston engine",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CN2",
        "ICAO": "n/a",
        "name ": "Cessna light aircraft - twin piston engines",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CNA",
        "ICAO": "n/a",
        "name ": "Cessna light aircraft",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CNC",
        "ICAO": "n/a",
        "name ": "Cessna light aircraft - single turboprop engine",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CNJ",
        "ICAO": "n/a",
        "name ": "Cessna Citation",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CNT",
        "ICAO": "n/a",
        "name ": "Cessna light aircraft - twin turboprop engines",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CR1",
        "ICAO": "CRJ1",
        "name ": "Canadair Regional Jet 100",
        "wake": "M",
        "code": "",
        "seats": 50
    },
    {
        "IATA": "CR2",
        "ICAO": "CRJ2",
        "name ": "Canadair Regional Jet 200",
        "wake": "M",
        "code": "",
        "seats": 50
    },
    {
        "IATA": "CR7",
        "ICAO": "CRJ7",
        "name ": "Canadair Regional Jet 700",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CR9",
        "ICAO": "CRJ9",
        "name ": "Canadair Regional Jet 900",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CRJ",
        "ICAO": "n/a",
        "name ": "Canadair Regional Jet",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CRV",
        "ICAO": "S210",
        "name ": "Aerospatiale (Sud Aviation) Se.210 Caravelle",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CS2",
        "ICAO": "C212",
        "name ": "CASA / IPTN 212 Aviocar",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CS5",
        "ICAO": "CN35",
        "name ": "CASA / IPTN CN-235",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CV4",
        "ICAO": "CVLP",
        "name ": "Convair CV-440 Metropolitan pax",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CV5",
        "ICAO": "CVLT",
        "name ": "Convair CV-580 pax",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CVF",
        "ICAO": "n/a",
        "name ": "Convair CV-240 / 440 / 580 / 600 / 640 Freighter",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CVR",
        "ICAO": "n/a",
        "name ": "Convair CV-240 / 440 / 580 / 600 / 640 pax",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CVV",
        "ICAO": "CVLP",
        "name ": "Convair CV-240 Freighter",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CVX",
        "ICAO": "CVLP",
        "name ": "Convair CV-440 Freighter",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CVY",
        "ICAO": "CVLT",
        "name ": "Convair CV-580 / 600 / 640 Freighter",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "CWC",
        "ICAO": "C46",
        "name ": "Curtiss C-46 Commando",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D10",
        "ICAO": "DC10",
        "name ": "Douglas DC-10 pax",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D11",
        "ICAO": "DC10",
        "name ": "Douglas DC-10-10/15 pax",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D1C",
        "ICAO": "DC10",
        "name ": "Douglas DC-10-30/40 pax",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D1F",
        "ICAO": "DC10",
        "name ": "Douglas DC-10 all Freighters",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D1M",
        "ICAO": "DC10",
        "name ": "Douglas DC-10 all Combi models",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D1X",
        "ICAO": "DC10",
        "name ": "Douglas DC-10-10 Freighter",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D1Y",
        "ICAO": "DC10",
        "name ": "Douglas DC-10-30 / 40 Freighters",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D28",
        "ICAO": "D228",
        "name ": "Fairchild Dornier Do.228",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D38",
        "ICAO": "D328",
        "name ": "Fairchild Dornier Do.328",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D3F",
        "ICAO": "DC3",
        "name ": "Douglas DC-3 Freighter",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D6F",
        "ICAO": "DC6",
        "name ": "Douglas DC-6A/B/C Freighter",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D8F",
        "ICAO": "n/a",
        "name ": "Douglas DC-8 all Freighters",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D8L",
        "ICAO": "DC86",
        "name ": "Douglas DC-8-62 pax",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D8M",
        "ICAO": "n/a",
        "name ": "Douglas DC-8 all Combi models",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D8Q",
        "ICAO": "DC87",
        "name ": "Douglas DC-8-72 pax",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D8T",
        "ICAO": "DC85",
        "name ": "Douglas DC-8-50 Freighter",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D8X",
        "ICAO": "n/a",
        "name ": "Douglas DC-8-61 / 62 / 63 Freighters",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D8Y",
        "ICAO": "DC87",
        "name ": "Douglas DC-8-71 / 72 / 73 Freighters",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D91",
        "ICAO": "DC91",
        "name ": "Douglas DC-9-10 pax",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D92",
        "ICAO": "DC92",
        "name ": "Douglas DC-9-20 pax",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D93",
        "ICAO": "DC93",
        "name ": "Douglas DC-9-30 pax",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D94",
        "ICAO": "DC94",
        "name ": "Douglas DC-9-40 pax",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D95",
        "ICAO": "DC95",
        "name ": "Douglas DC-9-50 pax",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D9C",
        "ICAO": "DC93",
        "name ": "Douglas DC-9-30 Freighter",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D9F",
        "ICAO": "DC94",
        "name ": "Douglas DC-9-40 Freighter",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D9F",
        "ICAO": "n/a",
        "name ": "Douglas DC-9 all Freighters",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "D9X",
        "ICAO": "DC91",
        "name ": "Douglas DC-9-10 Freighter",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DC3",
        "ICAO": "DC3",
        "name ": "Douglas DC-3 pax",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DC6",
        "ICAO": "DC6",
        "name ": "Douglas DC6A/B pax",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DC8",
        "ICAO": "n/a",
        "name ": "Douglas DC-8 all pax models",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DC9",
        "ICAO": "DC9",
        "name ": "Douglas DC-9 all pax models",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DF2",
        "ICAO": "n/a",
        "name ": "Dassault (Breguet Mystere) Falcon 10 / 100 / 20 / 200 / 2000",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DF3",
        "ICAO": "n/a",
        "name ": "Dassault (Breguet Mystere) Falcon 50 / 900",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DFL",
        "ICAO": "n/a",
        "name ": "Dassault (Breguet Mystere) Falcon",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DH1",
        "ICAO": "DH8A",
        "name ": "De Havilland Canada DHC-8-100 Dash 8 / 8Q",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DH2",
        "ICAO": "DH8B",
        "name ": "De Havilland Canada DHC-8-200 Dash 8 / 8Q",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DH3",
        "ICAO": "DH8C",
        "name ": "De Havilland Canada DHC-8-300 Dash 8 / 8Q",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DH4",
        "ICAO": "DH8D",
        "name ": "De Havilland Canada DHC-8-400 Dash 8Q",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DH7",
        "ICAO": "DHC7",
        "name ": "De Havilland Canada DHC-7 Dash 7",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DH8",
        "ICAO": "n/a",
        "name ": "De Havilland Canada DHC-8 Dash 8 all models",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DHB",
        "ICAO": "n/a",
        "name ": "De Havilland Canada DHC-2 Beaver / Turbo Beaver",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DHC",
        "ICAO": "DHC4",
        "name ": "De Havilland Canada DHC-4 Caribou",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DHD",
        "ICAO": "DOVE",
        "name ": "De Havilland DH.104 Dove",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DHH",
        "ICAO": "HERN",
        "name ": "De Havilland DH.114 Heron",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DHL",
        "ICAO": "DHC3",
        "name ": "De Havilland Canada DHC-3 Turbo Otter",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DHO",
        "ICAO": "DHC3",
        "name ": "De Havilland Canada DHC-3 Otter / Turbo Otter",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DHP",
        "ICAO": "DHC2",
        "name ": "De Havilland Canada DHC-2 Beaver",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DHR",
        "ICAO": "DH2T",
        "name ": "De Havilland Canada DHC-2 Turbo-Beaver",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DHS",
        "ICAO": "DHC3",
        "name ": "De Havilland Canada DHC-3 Otter",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "DHT",
        "ICAO": "DHC6",
        "name ": "De Havilland Canada DHC-6 Twin Otter",
        "wake": "L",
        "code": "B",
        "seats": 19
    },
    {
        "IATA": "E70",
        "ICAO": "E170",
        "name ": "Embraer 170",
        "wake": "M",
        "code": "C",
        "seats": 70
    },
    {
        "IATA": "E90",
        "ICAO": "E190",
        "name ": "Embraer 190",
        "wake": "M",
        "code": "C",
        "seats": 90
    },
    {
        "IATA": "EM2",
        "ICAO": "E120",
        "name ": "Embraer EMB.120 Brasilia",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "EMB",
        "ICAO": "E110",
        "name ": "Embraer EMB.110 Bandeirnate",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "EMJ",
        "ICAO": "",
        "name ": "Embraer 170/190",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "ER3",
        "ICAO": "E135",
        "name ": "Embraer RJ135",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "ER4",
        "ICAO": "E145",
        "name ": "Embraer RJ145 Amazon",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "ERD",
        "ICAO": "",
        "name ": "Embraer RJ140",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "ERJ",
        "ICAO": "n/a",
        "name ": "Embraer RJ135 / RJ140 / RJ145",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "F21",
        "ICAO": "F28",
        "name ": "Fokker F.28 Fellowship 1000",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "F22",
        "ICAO": "F28",
        "name ": "Fokker F.28 Fellowship 2000",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "F23",
        "ICAO": "F28",
        "name ": "Fokker F.28 Fellowship 3000",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "F24",
        "ICAO": "F28",
        "name ": "Fokker F.28 Fellowship 4000",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "F27",
        "ICAO": "F27",
        "name ": "Fokker F.27 Friendship / Fairchild F.27",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "F28",
        "ICAO": "F28",
        "name ": "Fokker F.28 Fellowship",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "F50",
        "ICAO": "F50",
        "name ": "Fokker 50",
        "wake": "M",
        "code": "",
        "seats": 46
    },
    {
        "IATA": "F70",
        "ICAO": "F70",
        "name ": "Fokker 70",
        "wake": "M",
        "code": "",
        "seats": 79
    },
    {
        "IATA": "FA7",
        "ICAO": "n/a",
        "name ": "Fairchild Dornier 728JET",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "FK7",
        "ICAO": "F27",
        "name ": "Fairchild FH.227",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "FRJ",
        "ICAO": "J328",
        "name ": "Fairchild Dornier 328JET",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "GRG",
        "ICAO": "G21",
        "name ": "Grumman G.21 Goose",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "GRJ",
        "ICAO": "n/a",
        "name ": "Gulfstream Aerospace G-1159 Gulfstream II / III / IV / V",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "GRM",
        "ICAO": "G73T",
        "name ": "Grumman G.73 Turbo Mallard",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "GRS",
        "ICAO": "G159",
        "name ": "Gulfstream Aerospace G-159 Gulfstream I",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "H25",
        "ICAO": "n/a",
        "name ": "British Aerospace (Hawker Siddeley) HS.125",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "HEC",
        "ICAO": "COUC",
        "name ": "Helio H-250 Courier / H-295 / 385 Super Courier",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "HOV",
        "ICAO": "n/a",
        "name ": "Hovercraft",
        "wake": "n/a",
        "code": "",
        "seats": null
    },
    {
        "IATA": "HS7",
        "ICAO": "A748",
        "name ": "Hawker Siddeley HS.748",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "I14",
        "ICAO": "I114",
        "name ": "Ilyushin IL114",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "I93",
        "ICAO": "IL96",
        "name ": "Ilyushin IL96-300 pax",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "I9F",
        "ICAO": "IL96",
        "name ": "Ilyushin IL96 Freighters",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "I9M",
        "ICAO": "IL96",
        "name ": "Ilyushin IL96M pax",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "I9X",
        "ICAO": "IL96",
        "name ": "Ilyushin IL96-300 Freighter",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "I9Y",
        "ICAO": "IL96",
        "name ": "Ilyushin IL96T Freighter",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "IL6",
        "ICAO": "IL62",
        "name ": "Ilyushin IL62",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "IL7",
        "ICAO": "IL76",
        "name ": "Ilyushin IL76 (Freighter)",
        "wake": "H",
        "code": "D",
        "seats": 0
    },
    {
        "IATA": "IL8",
        "ICAO": "IL18",
        "name ": "Ilyushin IL18",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "IL9",
        "ICAO": "IL96",
        "name ": "Ilyushin IL96 pax",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "ILW",
        "ICAO": "IL86",
        "name ": "Ilyushin IL86",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "J31",
        "ICAO": "JS31",
        "name ": "British Aerospace Jetstream 31",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "J32",
        "ICAO": "JS32",
        "name ": "British Aerospace Jetstream 32",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "J41",
        "ICAO": "JS41",
        "name ": "British Aerospace Jetstream 41",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "JST",
        "ICAO": "n/a",
        "name ": "British Aerospace Jetstream 31 / 32 / 41",
        "wake": "L/M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "JU5",
        "ICAO": "JU52",
        "name ": "Junkers Ju52/3M",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "L10",
        "ICAO": "L101",
        "name ": "Lockheed L-1011 Tristar pax",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "L11",
        "ICAO": "L101",
        "name ": "Lockheed L-1011 1 / 50 / 100 / 150 / 200 / 250 Tristar pax",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "L15",
        "ICAO": "L101",
        "name ": "Lockheed L-1011 500 Tristar pax",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "L1F",
        "ICAO": "L101",
        "name ": "Lockheed L-1011 Tristar Freighter",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "L49",
        "ICAO": "CONI",
        "name ": "Lockheed L-1049 Super Constellation",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "L4T",
        "ICAO": "L410",
        "name ": "LET 410",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "LCH",
        "ICAO": "n/a",
        "name ": "Launch - Boat",
        "wake": "n/a",
        "code": "",
        "seats": null
    },
    {
        "IATA": "LMO",
        "ICAO": "n/a",
        "name ": "Limousine",
        "wake": "n/a",
        "code": "",
        "seats": null
    },
    {
        "IATA": "LOE",
        "ICAO": "L188",
        "name ": "Lockheed L-188 Electra pax",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "LOF",
        "ICAO": "L188",
        "name ": "Lockheed L-188 Electra Freighter",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "LOH",
        "ICAO": "C130",
        "name ": "Lockheed L-182 / 282 / 382 (L-100) Hercules",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "LOM",
        "ICAO": "L188",
        "name ": "Lockheed L-188 Electra Mixed Configuration",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "LRJ",
        "ICAO": "n/a",
        "name ": "Gates Learjet",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "M11",
        "ICAO": "MD11",
        "name ": "McDonnell Douglas MD11 pax",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "M1F",
        "ICAO": "MD11",
        "name ": "McDonnell Douglas MD11 Freighter",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "M1M",
        "ICAO": "MD11",
        "name ": "McDonnell Douglas MD11 Mixed Configuration",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "M80",
        "ICAO": "MD80",
        "name ": "McDonnell Douglas MD80",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "M81",
        "ICAO": "MD81",
        "name ": "McDonnell Douglas MD81",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "M82",
        "ICAO": "MD82",
        "name ": "McDonnell Douglas MD82",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "M83",
        "ICAO": "MD83",
        "name ": "McDonnell Douglas MD83",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "M87",
        "ICAO": "MD87",
        "name ": "McDonnell Douglas MD87",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "M88",
        "ICAO": "MD88",
        "name ": "McDonnell Douglas MD88",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "M90",
        "ICAO": "MD90",
        "name ": "McDonnell Douglas MD90",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "MBH",
        "ICAO": "B105",
        "name ": "Eurocopter (MBB) Bo.105",
        "wake": "n/a",
        "code": "",
        "seats": null
    },
    {
        "IATA": "MD9",
        "ICAO": "EXPL",
        "name ": "MD Helicopters MD900 Explorer",
        "wake": "n/a",
        "code": "",
        "seats": null
    },
    {
        "IATA": "MIH",
        "ICAO": "MI8",
        "name ": "MIL Mi-8 / Mi-17 / Mi-171 / Mil-172",
        "wake": "n/a",
        "code": "",
        "seats": null
    },
    {
        "IATA": "MU2",
        "ICAO": "MU2",
        "name ": "Mitsubishi Mu-2",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "ND2",
        "ICAO": "N262",
        "name ": "Aerospatiale (Nord) 262",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "NDC",
        "ICAO": "S601",
        "name ": "Aerospatiale SN.601 Corvette",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "NDE",
        "ICAO": "n/a",
        "name ": "Eurocopter (Aerospatiale) AS350 Ecureuil / AS355 Ecureuil 2",
        "wake": "n/a",
        "code": "",
        "seats": null
    },
    {
        "IATA": "NDH",
        "ICAO": "S65C",
        "name ": "Eurocopter (Aerospatiale) SA365C / SA365N Dauphin 2",
        "wake": "n/a",
        "code": "",
        "seats": null
    },
    {
        "IATA": "PA1",
        "ICAO": "n/a",
        "name ": "Piper light aircraft - single piston engine",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "PA2",
        "ICAO": "n/a",
        "name ": "Piper light aircraft - twin piston engines",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "PAG",
        "ICAO": "n/a",
        "name ": "Piper light aircraft",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "PAT",
        "ICAO": "n/a",
        "name ": "Piper light aircraft - twin turboprop engines",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "PL2",
        "ICAO": "PC12",
        "name ": "Pilatus PC-12",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "PL6",
        "ICAO": "PC6T",
        "name ": "Pilatus PC-6 Turbo Porter",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "PN6",
        "ICAO": "P68",
        "name ": "Partenavia P.68",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "RFS",
        "ICAO": "n/a",
        "name ": "Road Feeder Service - Cargo Truck",
        "wake": "n/a",
        "code": "",
        "seats": null
    },
    {
        "IATA": "S20",
        "ICAO": "SB20",
        "name ": "Saab 2000",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "S58",
        "ICAO": "S58T",
        "name ": "Sikorsky S-58T",
        "wake": "n/a",
        "code": "",
        "seats": null
    },
    {
        "IATA": "S61",
        "ICAO": "S61",
        "name ": "Sikorsky S-61",
        "wake": "n/a",
        "code": "",
        "seats": null
    },
    {
        "IATA": "S76",
        "ICAO": "S76",
        "name ": "Sikorsky S-76",
        "wake": "n/a",
        "code": "",
        "seats": null
    },
    {
        "IATA": "SF3",
        "ICAO": "SF34",
        "name ": "Saab SF340A/B",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "SH3",
        "ICAO": "SH33",
        "name ": "Shorts SD.330",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "SH6",
        "ICAO": "SH36",
        "name ": "Shorts SD.360",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "SHB",
        "ICAO": "BELF",
        "name ": "Shorts SC-5 Belfast",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "SHS",
        "ICAO": "SC7",
        "name ": "Shorts SC-7 Skyvan",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "SSC",
        "ICAO": "CONC",
        "name ": "Aerospatiale/BAC Concorde",
        "wake": "H",
        "code": "",
        "seats": null
    },
    {
        "IATA": "SWM",
        "ICAO": "n/a",
        "name ": "Fairchild (Swearingen) SA26 / SA226 / SA227 Metro / Merlin / Expediter",
        "wake": "L",
        "code": "",
        "seats": null
    },
    {
        "IATA": "T20",
        "ICAO": "T204",
        "name ": "Tupolev Tu-204 / Tu-214",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "TRN",
        "ICAO": "n/a",
        "name ": "Train",
        "wake": "n/a",
        "code": "",
        "seats": null
    },
    {
        "IATA": "TU3",
        "ICAO": "T134",
        "name ": "Tupolev Tu134",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "TU5",
        "ICAO": "T154",
        "name ": "Tupolev Tu154",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "VCV",
        "ICAO": "VISC",
        "name ": "Vickers Viscount",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "WWP",
        "ICAO": "WW24",
        "name ": "Israel Aircraft Industries 1124 Westwind",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "YK2",
        "ICAO": "YK42",
        "name ": "Yakovlev Yak 42",
        "wake": "M",
        "code": "",
        "seats": 104
    },
    {
        "IATA": "YK4",
        "ICAO": "YK40",
        "name ": "Yakovlev Yak 40",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "YN2",
        "ICAO": "Y12",
        "name ": "Harbin Yunshuji Y12",
        "wake": "M",
        "code": "B",
        "seats": 17
    },
    {
        "IATA": "YN7",
        "ICAO": "AN24",
        "name ": "Xian Yunshuji Y7",
        "wake": "M",
        "code": "",
        "seats": null
    },
    {
        "IATA": "YS1",
        "ICAO": "YS11",
        "name ": "NAMC YS-11",
        "wake": "M",
        "code": "",
        "seats": null
    }
];