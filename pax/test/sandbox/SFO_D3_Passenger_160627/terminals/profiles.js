var allProfiles = [
  {
    "name": "all.business.domestic.departing",
    "count": 2840,
    "percentage": 22,
    "brfood": 73,
    "food": 51,
    "bags": 41,
    "brshop": 49,
    "shop": 19,
    "weighted": "FALSE"
  },
  {
    "name": "all.business.domestic.transfer",
    "count": 445,
    "percentage": 3,
    "brfood": 76,
    "food": 56,
    "bags": 29,
    "brshop": 50,
    "shop": 20,
    "weighted": "FALSE"
  },
  {
    "name": "all.business.international.departing",
    "count": 425,
    "percentage": 3,
    "brfood": 72,
    "food": 50,
    "bags": 73,
    "brshop": 42,
    "shop": 9,
    "weighted": "FALSE"
  },
  {
    "name": "all.business.international.transfer",
    "count": 213,
    "percentage": 2,
    "brfood": 76,
    "food": 56,
    "bags": 32,
    "brshop": 43,
    "shop": 11,
    "weighted": "FALSE"
  },
  {
    "name": "all.leisure.domestic.departing",
    "count": 2899,
    "percentage": 23,
    "brfood": 71,
    "food": 49,
    "bags": 66,
    "brshop": 50,
    "shop": 21,
    "weighted": "FALSE"
  },
  {
    "name": "all.leisure.domestic.transfer",
    "count": 716,
    "percentage": 6,
    "brfood": 77,
    "food": 57,
    "bags": 31,
    "brshop": 48,
    "shop": 18,
    "weighted": "FALSE"
  },
  {
    "name": "all.leisure.international.departing",
    "count": 999,
    "percentage": 8,
    "brfood": 72,
    "food": 50,
    "bags": 87,
    "brshop": 42,
    "shop": 10,
    "weighted": "FALSE"
  },
  {
    "name": "all.leisure.international.transfer",
    "count": 455,
    "percentage": 4,
    "brfood": 75,
    "food": 55,
    "bags": 30,
    "brshop": 41,
    "shop": 8,
    "weighted": "FALSE"
  },
  {
    "name": "all.other.domestic.departing",
    "count": 2302,
    "percentage": 18,
    "brfood": 68,
    "food": 45,
    "bags": 56,
    "brshop": 49,
    "shop": 19,
    "weighted": "FALSE"
  },
  {
    "name": "all.other.domestic.transfer",
    "count": 620,
    "percentage": 5,
    "brfood": 71,
    "food": 49,
    "bags": 31,
    "brshop": 51,
    "shop": 21,
    "weighted": "FALSE"
  },
  {
    "name": "all.other.international.departing",
    "count": 553,
    "percentage": 4,
    "brfood": 67,
    "food": 44,
    "bags": 85,
    "brshop": 42,
    "shop": 9,
    "weighted": "FALSE"
  },
  {
    "name": "all.other.international.transfer",
    "count": 365,
    "percentage": 3,
    "brfood": 75,
    "food": 55,
    "bags": 36,
    "brshop": 43,
    "shop": 10,
    "weighted": "FALSE"
  }
];
var t1Profiles = [
  {
    "name": "t1.business.domestic.departing",
    "count": 1164,
    "percentage": 33,
    "brfood": 70,
    "food": 47,
    "bags": 42,
    "brshop": 48,
    "shop": 17
  },
  {
    "name": "t1.business.domestic.transfer",
    "count": 89,
    "percentage": 3,
    "brfood": 74,
    "food": 53,
    "bags": 39,
    "brshop": 43,
    "shop": 10
  },
  {
    "name": "t1.business.international.departing",
    "count": 1,
    "percentage": 0,
    "brfood": 100,
    "food": 100,
    "bags": 0,
    "brshop": 35,
    "shop": 0
  },
  {
    "name": "t1.business.international.transfer",
    "count": 0,
    "percentage": 0,
    "brfood": 0,
    "food": "NaN",
    "bags": "NaN",
    "brshop": 0,
    "shop": "NaN"
  },
  {
    "name": "t1.leisure.domestic.departing",
    "count": 1076,
    "percentage": 31,
    "brfood": 69,
    "food": 46,
    "bags": 67,
    "brshop": 49,
    "shop": 19
  },
  {
    "name": "t1.leisure.domestic.transfer",
    "count": 96,
    "percentage": 3,
    "brfood": 74,
    "food": 53,
    "bags": 48,
    "brshop": 44,
    "shop": 11
  },
  {
    "name": "t1.leisure.international.departing",
    "count": 29,
    "percentage": 1,
    "brfood": 86,
    "food": 69,
    "bags": 79,
    "brshop": 35,
    "shop": 0
  },
  {
    "name": "t1.leisure.international.transfer",
    "count": 8,
    "percentage": 0,
    "brfood": 54,
    "food": 25,
    "bags": 0,
    "brshop": 35,
    "shop": 0
  },
  {
    "name": "t1.other.domestic.departing",
    "count": 926,
    "percentage": 27,
    "brfood": 67,
    "food": 43,
    "bags": 55,
    "brshop": 48,
    "shop": 17
  },
  {
    "name": "t1.other.domestic.transfer",
    "count": 100,
    "percentage": 3,
    "brfood": 69,
    "food": 46,
    "bags": 33,
    "brshop": 43,
    "shop": 10
  },
  {
    "name": "t1.other.international.departing",
    "count": 4,
    "percentage": 0,
    "brfood": 90,
    "food": 75,
    "bags": 100,
    "brshop": 35,
    "shop": 0
  },
  {
    "name": "t1.other.international.transfer",
    "count": 0,
    "percentage": 0,
    "brfood": 0,
    "food": "NaN",
    "bags": "NaN",
    "brshop": 0,
    "shop": "NaN"
  }
];
var t2Profiles = [
  {
    "name": "t2.business.domestic.departing",
    "count": 640,
    "percentage": 31,
    "brfood": 76,
    "food": 55,
    "bags": 41,
    "brshop": 49,
    "shop": 19,
    "weighted": "FALSE"
  },
  {
    "name": "t2.business.domestic.transfer",
    "count": 48,
    "percentage": 2,
    "brfood": 78,
    "food": 58,
    "bags": 38,
    "brshop": 54,
    "shop": 25,
    "weighted": "FALSE"
  },
  {
    "name": "t2.business.international.departing",
    "count": 1,
    "percentage": 0,
    "brfood": 35,
    "food": 0,
    "bags": 100,
    "brshop": 35,
    "shop": 0,
    "weighted": "FALSE"
  },
  {
    "name": "t2.business.international.transfer",
    "count": 0,
    "percentage": 0,
    "brfood": 0,
    "food": "NaN",
    "bags": "NaN",
    "brshop": 0,
    "shop": "NaN",
    "weighted": "FALSE"
  },
  {
    "name": "t2.leisure.domestic.departing",
    "count": 694,
    "percentage": 33,
    "brfood": 73,
    "food": 52,
    "bags": 59,
    "brshop": 50,
    "shop": 20,
    "weighted": "FALSE"
  },
  {
    "name": "t2.leisure.domestic.transfer",
    "count": 87,
    "percentage": 4,
    "brfood": 81,
    "food": 63,
    "bags": 38,
    "brshop": 50,
    "shop": 21,
    "weighted": "FALSE"
  },
  {
    "name": "t2.leisure.international.departing",
    "count": 20,
    "percentage": 1,
    "brfood": 79,
    "food": 60,
    "bags": 95,
    "brshop": 35,
    "shop": 0,
    "weighted": "FALSE"
  },
  {
    "name": "t2.leisure.international.transfer",
    "count": 3,
    "percentage": 0,
    "brfood": 84,
    "food": 67,
    "bags": 67,
    "brshop": 35,
    "shop": 0,
    "weighted": "FALSE"
  },
  {
    "name": "t2.other.domestic.departing",
    "count": 509,
    "percentage": 24,
    "brfood": 69,
    "food": 47,
    "bags": 51,
    "brshop": 48,
    "shop": 18,
    "weighted": "FALSE"
  },
  {
    "name": "t2.other.domestic.transfer",
    "count": 74,
    "percentage": 4,
    "brfood": 68,
    "food": 45,
    "bags": 30,
    "brshop": 48,
    "shop": 18,
    "weighted": "FALSE"
  },
  {
    "name": "t2.other.international.departing",
    "count": 6,
    "percentage": 0,
    "brfood": 72,
    "food": 50,
    "bags": 67,
    "brshop": 35,
    "shop": 0,
    "weighted": "FALSE"
  },
  {
    "name": "t2.other.international.transfer",
    "count": 1,
    "percentage": 0,
    "brfood": 108,
    "food": 100,
    "bags": 100,
    "brshop": 35,
    "shop": 0,
    "weighted": "FALSE"
  }
];
var t3Profiles = [
  {
    "name": "t3.business.domestic.departing",
    "count": 568,
    "percentage": 24,
    "brfood": 73,
    "food": 52,
    "bags": 34,
    "brshop": 48,
    "shop": 17,
    "weighted": "FALSE"
  },
  {
    "name": "t3.business.domestic.transfer",
    "count": 242,
    "percentage": 10,
    "brfood": 76,
    "food": 56,
    "bags": 21,
    "brshop": 49,
    "shop": 18,
    "weighted": "FALSE"
  },
  {
    "name": "t3.business.international.departing",
    "count": 15,
    "percentage": 1,
    "brfood": 84,
    "food": 67,
    "bags": 60,
    "brshop": 35,
    "shop": 0,
    "weighted": "FALSE"
  },
  {
    "name": "t3.business.international.transfer",
    "count": 10,
    "percentage": 0,
    "brfood": 94,
    "food": 80,
    "bags": 40,
    "brshop": 35,
    "shop": 0,
    "weighted": "FALSE"
  },
  {
    "name": "t3.leisure.domestic.departing",
    "count": 403,
    "percentage": 17,
    "brfood": 74,
    "food": 53,
    "bags": 63,
    "brshop": 46,
    "shop": 15,
    "weighted": "FALSE"
  },
  {
    "name": "t3.leisure.domestic.transfer",
    "count": 403,
    "percentage": 17,
    "brfood": 77,
    "food": 57,
    "bags": 25,
    "brshop": 45,
    "shop": 13,
    "weighted": "FALSE"
  },
  {
    "name": "t3.leisure.international.departing",
    "count": 36,
    "percentage": 2,
    "brfood": 86,
    "food": 69,
    "bags": 81,
    "brshop": 35,
    "shop": 0,
    "weighted": "FALSE"
  },
  {
    "name": "t3.leisure.international.transfer",
    "count": 47,
    "percentage": 2,
    "brfood": 86,
    "food": 70,
    "bags": 28,
    "brshop": 38,
    "shop": 4,
    "weighted": "FALSE"
  },
  {
    "name": "t3.other.domestic.departing",
    "count": 307,
    "percentage": 13,
    "brfood": 69,
    "food": 47,
    "bags": 45,
    "brshop": 47,
    "shop": 17,
    "weighted": "FALSE"
  },
  {
    "name": "t3.other.domestic.transfer",
    "count": 323,
    "percentage": 13,
    "brfood": 73,
    "food": 52,
    "bags": 24,
    "brshop": 50,
    "shop": 20,
    "weighted": "FALSE"
  },
  {
    "name": "t3.other.international.departing",
    "count": 26,
    "percentage": 1,
    "brfood": 66,
    "food": 42,
    "bags": 50,
    "brshop": 35,
    "shop": 0,
    "weighted": "FALSE"
  },
  {
    "name": "t3.other.international.transfer",
    "count": 20,
    "percentage": 1,
    "brfood": 83,
    "food": 65,
    "bags": 35,
    "brshop": 35,
    "shop": 0,
    "weighted": "FALSE"
  }
];
var tiProfiles = [
  {
    "name": "ti.business.domestic.departing",
    "count": 468,
    "percentage": 10,
    "brfood": 75,
    "food": 54,
    "bags": 47,
    "brshop": 54,
    "shop": 26,
    "weighted": "FALSE"
  },
  {
    "name": "ti.business.domestic.transfer",
    "count": 66,
    "percentage": 1,
    "brfood": 78,
    "food": 59,
    "bags": 33,
    "brshop": 62,
    "shop": 36,
    "weighted": "FALSE"
  },
  {
    "name": "ti.business.international.departing",
    "count": 408,
    "percentage": 8,
    "brfood": 71,
    "food": 50,
    "bags": 74,
    "brshop": 42,
    "shop": 9,
    "weighted": "FALSE"
  },
  {
    "name": "ti.business.international.transfer",
    "count": 203,
    "percentage": 4,
    "brfood": 75,
    "food": 55,
    "bags": 32,
    "brshop": 44,
    "shop": 11,
    "weighted": "FALSE"
  },
  {
    "name": "ti.leisure.domestic.departing",
    "count": 726,
    "percentage": 15,
    "brfood": 70,
    "food": 48,
    "bags": 72,
    "brshop": 55,
    "shop": 27,
    "weighted": "FALSE"
  },
  {
    "name": "ti.leisure.domestic.transfer",
    "count": 130,
    "percentage": 3,
    "brfood": 77,
    "food": 58,
    "bags": 32,
    "brshop": 60,
    "shop": 34,
    "weighted": "FALSE"
  },
  {
    "name": "ti.leisure.international.departing",
    "count": 914,
    "percentage": 19,
    "brfood": 71,
    "food": 49,
    "bags": 88,
    "brshop": 43,
    "shop": 10,
    "weighted": "FALSE"
  },
  {
    "name": "ti.leisure.international.transfer",
    "count": 397,
    "percentage": 8,
    "brfood": 74,
    "food": 54,
    "bags": 30,
    "brshop": 42,
    "shop": 9,
    "weighted": "FALSE"
  },
  {
    "name": "ti.other.domestic.departing",
    "count": 560,
    "percentage": 12,
    "brfood": 68,
    "food": 45,
    "bags": 67,
    "brshop": 54,
    "shop": 25,
    "weighted": "FALSE"
  },
  {
    "name": "ti.other.domestic.transfer",
    "count": 123,
    "percentage": 3,
    "brfood": 67,
    "food": 43,
    "bags": 46,
    "brshop": 60,
    "shop": 34,
    "weighted": "FALSE"
  },
  {
    "name": "ti.other.international.departing",
    "count": 517,
    "percentage": 11,
    "brfood": 67,
    "food": 43,
    "bags": 87,
    "brshop": 43,
    "shop": 10,
    "weighted": "FALSE"
  },
  {
    "name": "ti.other.international.transfer",
    "count": 344,
    "percentage": 7,
    "brfood": 74,
    "food": 54,
    "bags": 36,
    "brshop": 43,
    "shop": 10,
    "weighted": "FALSE"
  }
];