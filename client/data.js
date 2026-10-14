/* ============================================================================
   data.js — Wina Bwangu reference data (client-side prototype)

   Everything the prototype needs to run without a server lives here.
   In Exercise 3 this file is replaced by responses from the server-side API;
   the shapes below are deliberately the shapes the API should return.
   ========================================================================== */

var WINA = (function () {
  'use strict';

  /* Table 1 — mobile booths and their locations ---------------------------- */
  var BOOTHS = [
    { code: 'Wina1', location: 'Lusaka CPD' },
    { code: 'Wina2', location: 'Libala' },
    { code: 'Wina3', location: 'Kabwata' },
    { code: 'Wina4', location: 'Mandevu' },
    { code: 'Wina5', location: 'Woodlands' },
    { code: 'Wina6', location: 'Matero East' }
  ];

  /* Table 2 — services, monthly limits and revenue per kwacha --------------
     `hue` is the colour this service is drawn in everywhere in the UI
     (gauges, data bars, pie slices) so the reader learns one colour key. */
  var SERVICES = [
    { name: 'Airtel Money',  limit: 350000, rate: 0.05,  hue: '#CE3A22' },
    { name: 'MTN Money',     limit: 160000, rate: 0.06,  hue: '#E3A80B' },
    { name: 'Zamtel Money',  limit: 70000,  rate: 0.045, hue: '#5B8C2A' },
    { name: 'Zanaco',        limit: 80000,  rate: 0.035, hue: '#2B5FA8' },
    { name: 'FNB',           limit: 80000,  rate: 0.04,  hue: '#6B4FA8' }
  ];

  /* Which services each booth is allowed to sell (case study, page 1).
     The capture form reads only from here — a booth can never be offered a
     service it does not carry. */
  var CATALOGUE = {
    Wina1: ['Airtel Money', 'MTN Money', 'Zamtel Money', 'Zanaco', 'FNB'],
    Wina2: ['Airtel Money', 'MTN Money', 'Zamtel Money', 'FNB'],
    Wina3: ['Airtel Money', 'MTN Money', 'Zamtel Money', 'Zanaco', 'FNB'],
    Wina4: ['Airtel Money', 'MTN Money', 'Zamtel Money'],
    Wina5: ['Airtel Money', 'MTN Money', 'Zanaco', 'FNB'],
    Wina6: ['Airtel Money', 'MTN Money', 'Zamtel Money']
  };

  /* Business rules ---------------------------------------------------------
     TAX_RATE  — VAT charged on the commission Wina Bwangu earns.
     MIN/MAX   — per-transaction floor and ceiling enforced by the capture form.
     ID_PREFIX — TransactionID format is prefix + 7 digits, e.g. WB0000309. */
  var RULES = {
    period: 'February 2021',
    currency: 'K',
    TAX_RATE: 0.16,
    MIN_AMOUNT: 20,
    MAX_AMOUNT: 10000,
    ID_PREFIX: 'WB',
    ID_DIGITS: 7
  };

  /* Seeded transactions — Appendix 1, all 308 rows.
     Stored normalised as [transactionId, booth, service, amount]; location and
     revenue per kwacha are looked up, never duplicated, so they cannot drift. */
  var SEED = [
  ["WB0000001","Wina1","Airtel Money",964], ["WB0000002","Wina1","MTN Money",220], ["WB0000003","Wina2","MTN Money",582], ["WB0000004","Wina3","Zamtel Money",349],
  ["WB0000005","Wina4","Airtel Money",328], ["WB0000006","Wina3","MTN Money",192], ["WB0000007","Wina3","Zanaco",1519], ["WB0000008","Wina4","Zamtel Money",1113],
  ["WB0000009","Wina1","FNB",1999], ["WB0000010","Wina3","Airtel Money",3810], ["WB0000011","Wina6","Zamtel Money",3270], ["WB0000012","Wina3","Zanaco",1092],
  ["WB0000013","Wina2","Airtel Money",1056], ["WB0000014","Wina3","Airtel Money",509], ["WB0000015","Wina5","FNB",34], ["WB0000016","Wina2","MTN Money",1658],
  ["WB0000017","Wina5","Zamtel Money",2167], ["WB0000018","Wina3","Airtel Money",2594], ["WB0000019","Wina4","Airtel Money",3656], ["WB0000020","Wina3","Airtel Money",4030],
  ["WB0000021","Wina3","Zanaco",989], ["WB0000022","Wina3","Airtel Money",4081], ["WB0000023","Wina4","Airtel Money",925], ["WB0000024","Wina2","MTN Money",2312],
  ["WB0000025","Wina3","Zanaco",3280], ["WB0000026","Wina4","Airtel Money",90], ["WB0000027","Wina5","FNB",2556], ["WB0000028","Wina3","Zanaco",673],
  ["WB0000029","Wina4","MTN Money",4185], ["WB0000030","Wina1","Zanaco",412], ["WB0000031","Wina1","MTN Money",310], ["WB0000032","Wina2","MTN Money",4248],
  ["WB0000033","Wina3","Airtel Money",4105], ["WB0000034","Wina4","Airtel Money",1147], ["WB0000035","Wina3","Zamtel Money",1815], ["WB0000036","Wina3","Zanaco",1653],
  ["WB0000037","Wina4","Airtel Money",1045], ["WB0000038","Wina1","FNB",4364], ["WB0000039","Wina3","MTN Money",2822], ["WB0000040","Wina6","Airtel Money",2046],
  ["WB0000041","Wina3","Zamtel Money",1985], ["WB0000042","Wina2","MTN Money",3023], ["WB0000043","Wina3","Airtel Money",3728], ["WB0000044","Wina5","MTN Money",58],
  ["WB0000045","Wina2","Airtel Money",2744], ["WB0000046","Wina5","FNB",1654], ["WB0000047","Wina3","Airtel Money",1331], ["WB0000048","Wina4","Airtel Money",801],
  ["WB0000049","Wina3","MTN Money",967], ["WB0000050","Wina3","MTN Money",1988], ["WB0000051","Wina3","Airtel Money",3646], ["WB0000052","Wina4","Airtel Money",54],
  ["WB0000053","Wina2","Zamtel Money",2121], ["WB0000054","Wina3","Zanaco",564], ["WB0000055","Wina4","Airtel Money",1011], ["WB0000056","Wina5","FNB",2950],
  ["WB0000057","Wina3","Zanaco",57], ["WB0000058","Wina4","Airtel Money",2382], ["WB0000059","Wina1","MTN Money",349], ["WB0000060","Wina1","Airtel Money",2479],
  ["WB0000061","Wina2","Airtel Money",1537], ["WB0000062","Wina3","Zamtel Money",2802], ["WB0000063","Wina4","Airtel Money",1290], ["WB0000064","Wina3","MTN Money",4331],
  ["WB0000065","Wina3","Zanaco",1338], ["WB0000066","Wina4","Airtel Money",1477], ["WB0000067","Wina1","Airtel Money",3430], ["WB0000068","Wina3","MTN Money",451],
  ["WB0000069","Wina6","Airtel Money",80], ["WB0000070","Wina3","Zanaco",2002], ["WB0000071","Wina2","Airtel Money",3235], ["WB0000072","Wina3","MTN Money",4156],
  ["WB0000073","Wina5","Airtel Money",22], ["WB0000074","Wina2","Airtel Money",2156], ["WB0000075","Wina5","MTN Money",2267], ["WB0000076","Wina3","Zamtel Money",2419],
  ["WB0000077","Wina4","Airtel Money",1691], ["WB0000078","Wina3","Airtel Money",2736], ["WB0000079","Wina3","MTN Money",4282], ["WB0000080","Wina3","Zamtel Money",2331],
  ["WB0000081","Wina4","Airtel Money",1405], ["WB0000082","Wina2","Airtel Money",945], ["WB0000083","Wina3","Zanaco",688], ["WB0000084","Wina4","Airtel Money",189],
  ["WB0000085","Wina5","FNB",3787], ["WB0000086","Wina3","Zanaco",3407], ["WB0000087","Wina4","Airtel Money",1105], ["WB0000088","Wina6","Airtel Money",174],
  ["WB0000089","Wina2","MTN Money",1440], ["WB0000090","Wina6","Airtel Money",3344], ["WB0000091","Wina2","Airtel Money",2676], ["WB0000092","Wina2","Airtel Money",812],
  ["WB0000093","Wina3","Zanaco",4224], ["WB0000094","Wina3","Airtel Money",592], ["WB0000095","Wina3","Airtel Money",1662], ["WB0000096","Wina2","Airtel Money",1915],
  ["WB0000097","Wina3","Airtel Money",1866], ["WB0000098","Wina6","MTN Money",4320], ["WB0000099","Wina2","Airtel Money",228], ["WB0000100","Wina6","Airtel Money",3318],
  ["WB0000101","Wina2","Airtel Money",3615], ["WB0000102","Wina2","Airtel Money",4156], ["WB0000103","Wina3","Zamtel Money",1401], ["WB0000104","Wina3","Airtel Money",2014],
  ["WB0000105","Wina3","MTN Money",3475], ["WB0000106","Wina2","MTN Money",2452], ["WB0000107","Wina3","Zanaco",1720], ["WB0000108","Wina2","Airtel Money",118],
  ["WB0000109","Wina3","MTN Money",779], ["WB0000110","Wina4","Airtel Money",1623], ["WB0000111","Wina3","Airtel Money",2679], ["WB0000112","Wina3","Zanaco",1976],
  ["WB0000113","Wina4","Airtel Money",974], ["WB0000114","Wina1","Airtel Money",2911], ["WB0000115","Wina3","Zanaco",279], ["WB0000116","Wina6","Airtel Money",3646],
  ["WB0000117","Wina3","MTN Money",855], ["WB0000118","Wina2","Airtel Money",1412], ["WB0000119","Wina3","Airtel Money",2137], ["WB0000120","Wina5","FNB",1800],
  ["WB0000121","Wina2","Airtel Money",1219], ["WB0000122","Wina5","FNB",3582], ["WB0000123","Wina3","Airtel Money",760], ["WB0000124","Wina4","MTN Money",2308],
  ["WB0000125","Wina1","Zamtel Money",1941], ["WB0000126","Wina3","Airtel Money",2068], ["WB0000127","Wina6","MTN Money",4242], ["WB0000128","Wina3","Airtel Money",2587],
  ["WB0000129","Wina2","Zamtel Money",4196], ["WB0000130","Wina3","Airtel Money",1463], ["WB0000131","Wina5","FNB",2199], ["WB0000132","Wina2","Airtel Money",2956],
  ["WB0000133","Wina5","FNB",1663], ["WB0000134","Wina3","Airtel Money",2525], ["WB0000135","Wina4","Airtel Money",4404], ["WB0000136","Wina3","MTN Money",1012],
  ["WB0000137","Wina3","Airtel Money",69], ["WB0000138","Wina3","Airtel Money",4241], ["WB0000139","Wina4","MTN Money",3379], ["WB0000140","Wina2","MTN Money",3255],
  ["WB0000141","Wina3","Zanaco",1705], ["WB0000142","Wina4","Airtel Money",1039], ["WB0000143","Wina5","FNB",254], ["WB0000144","Wina3","MTN Money",870],
  ["WB0000145","Wina4","MTN Money",772], ["WB0000146","Wina1","Zamtel Money",1791], ["WB0000147","Wina3","Airtel Money",3320], ["WB0000148","Wina4","Airtel Money",4185],
  ["WB0000149","Wina1","MTN Money",100], ["WB0000150","Wina3","MTN Money",3794], ["WB0000151","Wina6","Airtel Money",498], ["WB0000152","Wina3","Airtel Money",2566],
  ["WB0000153","Wina2","Airtel Money",4459], ["WB0000154","Wina3","Airtel Money",3916], ["WB0000155","Wina5","FNB",528], ["WB0000156","Wina2","FNB",2067],
  ["WB0000157","Wina5","FNB",1119], ["WB0000158","Wina3","Airtel Money",1209], ["WB0000159","Wina4","Airtel Money",1950], ["WB0000160","Wina3","MTN Money",1268],
  ["WB0000161","Wina3","Zanaco",1066], ["WB0000162","Wina3","Airtel Money",4419], ["WB0000163","Wina4","Airtel Money",2065], ["WB0000164","Wina2","FNB",2663],
  ["WB0000165","Wina3","Airtel Money",2075], ["WB0000166","Wina4","Zamtel Money",3284], ["WB0000167","Wina5","Airtel Money",425], ["WB0000168","Wina3","Zanaco",1856],
  ["WB0000169","Wina4","Airtel Money",405], ["WB0000170","Wina1","FNB",608], ["WB0000171","Wina1","Zamtel Money",4143], ["WB0000172","Wina3","Airtel Money",681],
  ["WB0000173","Wina6","MTN Money",4405], ["WB0000174","Wina3","Airtel Money",3980], ["WB0000175","Wina2","Zamtel Money",2510], ["WB0000176","Wina3","Airtel Money",2807],
  ["WB0000177","Wina5","FNB",474], ["WB0000178","Wina2","Airtel Money",75], ["WB0000179","Wina5","FNB",2581], ["WB0000180","Wina3","Airtel Money",3938],
  ["WB0000181","Wina4","Airtel Money",3419], ["WB0000182","Wina3","MTN Money",1047], ["WB0000183","Wina3","Airtel Money",205], ["WB0000184","Wina3","Airtel Money",495],
  ["WB0000185","Wina4","MTN Money",3107], ["WB0000186","Wina2","MTN Money",2597], ["WB0000187","Wina3","Zanaco",3049], ["WB0000188","Wina4","Airtel Money",2713],
  ["WB0000189","Wina5","FNB",1727], ["WB0000190","Wina3","MTN Money",2060], ["WB0000191","Wina4","MTN Money",268], ["WB0000192","Wina1","Zamtel Money",2327],
  ["WB0000193","Wina3","Airtel Money",3027], ["WB0000194","Wina4","Airtel Money",897], ["WB0000195","Wina1","MTN Money",2275], ["WB0000196","Wina3","MTN Money",1246],
  ["WB0000197","Wina6","Airtel Money",2768], ["WB0000198","Wina3","Airtel Money",3082], ["WB0000199","Wina2","Airtel Money",4307], ["WB0000200","Wina3","Airtel Money",3664],
  ["WB0000201","Wina5","FNB",3274], ["WB0000202","Wina2","FNB",2854], ["WB0000203","Wina5","FNB",1253], ["WB0000204","Wina3","Airtel Money",812],
  ["WB0000205","Wina4","Airtel Money",962], ["WB0000206","Wina3","MTN Money",2219], ["WB0000207","Wina3","Zanaco",4407], ["WB0000208","Wina3","Airtel Money",3825],
  ["WB0000209","Wina4","Airtel Money",2162], ["WB0000210","Wina2","FNB",883], ["WB0000211","Wina3","Airtel Money",1506], ["WB0000212","Wina4","Zamtel Money",394],
  ["WB0000213","Wina5","Airtel Money",4272], ["WB0000214","Wina3","Zanaco",4187], ["WB0000215","Wina4","Airtel Money",913], ["WB0000216","Wina1","FNB",3651],
  ["WB0000217","Wina1","Zamtel Money",1000], ["WB0000218","Wina3","Airtel Money",839], ["WB0000219","Wina6","MTN Money",1851], ["WB0000220","Wina3","Airtel Money",1341],
  ["WB0000221","Wina2","Zamtel Money",3150], ["WB0000222","Wina3","Airtel Money",3050], ["WB0000223","Wina5","FNB",4489], ["WB0000224","Wina2","Airtel Money",3432],
  ["WB0000225","Wina5","FNB",136], ["WB0000226","Wina3","Airtel Money",2318], ["WB0000227","Wina4","Airtel Money",4327], ["WB0000228","Wina3","MTN Money",1653],
  ["WB0000229","Wina3","Airtel Money",20], ["WB0000230","Wina3","Airtel Money",1219], ["WB0000231","Wina4","MTN Money",1508], ["WB0000232","Wina2","MTN Money",1205],
  ["WB0000233","Wina3","Zanaco",1589], ["WB0000234","Wina4","Airtel Money",1280], ["WB0000235","Wina5","FNB",335], ["WB0000236","Wina3","MTN Money",2268],
  ["WB0000237","Wina4","MTN Money",2815], ["WB0000238","Wina1","Zamtel Money",4414], ["WB0000239","Wina3","Airtel Money",654], ["WB0000240","Wina4","Airtel Money",2180],
  ["WB0000241","Wina1","MTN Money",2869], ["WB0000242","Wina3","MTN Money",3757], ["WB0000243","Wina6","Airtel Money",2038], ["WB0000244","Wina3","Airtel Money",1344],
  ["WB0000245","Wina2","Airtel Money",526], ["WB0000246","Wina3","Airtel Money",192], ["WB0000247","Wina5","FNB",866], ["WB0000248","Wina2","FNB",3568],
  ["WB0000249","Wina5","FNB",729], ["WB0000250","Wina3","Airtel Money",3331], ["WB0000251","Wina4","Airtel Money",336], ["WB0000252","Wina3","MTN Money",976],
  ["WB0000253","Wina3","Zanaco",89], ["WB0000254","Wina3","Airtel Money",630], ["WB0000255","Wina4","Airtel Money",3161], ["WB0000256","Wina2","FNB",4200],
  ["WB0000257","Wina3","Airtel Money",3887], ["WB0000258","Wina4","Zamtel Money",4421], ["WB0000259","Wina5","Airtel Money",1863], ["WB0000260","Wina3","Zanaco",2465],
  ["WB0000261","Wina4","Airtel Money",3775], ["WB0000262","Wina1","FNB",2897], ["WB0000263","Wina1","Zamtel Money",3994], ["WB0000264","Wina3","Airtel Money",586],
  ["WB0000265","Wina6","MTN Money",2562], ["WB0000266","Wina3","Airtel Money",3867], ["WB0000267","Wina2","Zamtel Money",4208], ["WB0000268","Wina3","Airtel Money",4471],
  ["WB0000269","Wina5","FNB",303], ["WB0000270","Wina2","Airtel Money",4261], ["WB0000271","Wina5","FNB",1122], ["WB0000272","Wina3","Airtel Money",1396],
  ["WB0000273","Wina4","Airtel Money",905], ["WB0000274","Wina3","MTN Money",4002], ["WB0000275","Wina3","Airtel Money",1591], ["WB0000276","Wina3","Airtel Money",3353],
  ["WB0000277","Wina4","MTN Money",3364], ["WB0000278","Wina2","MTN Money",4129], ["WB0000279","Wina3","Zanaco",1003], ["WB0000280","Wina4","Airtel Money",2475],
  ["WB0000281","Wina5","FNB",3597], ["WB0000282","Wina3","MTN Money",1659], ["WB0000283","Wina4","MTN Money",4163], ["WB0000284","Wina1","Zamtel Money",487],
  ["WB0000285","Wina3","Airtel Money",3790], ["WB0000286","Wina4","Airtel Money",2186], ["WB0000287","Wina1","MTN Money",1894], ["WB0000288","Wina3","MTN Money",1458],
  ["WB0000289","Wina6","Airtel Money",875], ["WB0000290","Wina3","Airtel Money",189], ["WB0000291","Wina2","Airtel Money",4479], ["WB0000292","Wina3","Airtel Money",3733],
  ["WB0000293","Wina5","FNB",640], ["WB0000294","Wina2","FNB",413], ["WB0000295","Wina5","FNB",880], ["WB0000296","Wina3","Airtel Money",2921],
  ["WB0000297","Wina4","Airtel Money",3428], ["WB0000298","Wina3","MTN Money",4103], ["WB0000299","Wina3","Zanaco",2610], ["WB0000300","Wina3","Airtel Money",3813],
  ["WB0000301","Wina4","Airtel Money",1899], ["WB0000302","Wina2","FNB",1284], ["WB0000303","Wina3","Airtel Money",2928], ["WB0000304","Wina4","Zamtel Money",301],
  ["WB0000305","Wina5","Airtel Money",3672], ["WB0000306","Wina3","Zanaco",1542], ["WB0000307","Wina4","Airtel Money",2001], ["WB0000308","Wina1","FNB",3166]
  ];

  /* Lookups ---------------------------------------------------------------- */
  var boothIndex = {}, serviceIndex = {};
  BOOTHS.forEach(function (b) { boothIndex[b.code] = b; });
  SERVICES.forEach(function (s) { serviceIndex[s.name] = s; });

  function locationOf(code) {
    return boothIndex[code] ? boothIndex[code].location : '';
  }
  function serviceOf(name) {
    return serviceIndex[name] || null;
  }
  function rateOf(name) {
    return serviceIndex[name] ? serviceIndex[name].rate : 0;
  }
  function servicesAt(code) {
    return (CATALOGUE[code] || []).map(serviceOf);
  }
  function hueOf(name) {
    return serviceIndex[name] ? serviceIndex[name].hue : '#5C6F6A';
  }

  /* Expand a normalised seed row into the full record the UI works with. */
  function expand(row) {
    return {
      transactionId: row[0],
      booth: row[1],
      location: locationOf(row[1]),
      service: row[2],
      revenuePerKwacha: rateOf(row[2]),
      transactionAmount: row[3]
    };
  }

  return {
    BOOTHS: BOOTHS,
    SERVICES: SERVICES,
    CATALOGUE: CATALOGUE,
    RULES: RULES,
    SEED: SEED,
    locationOf: locationOf,
    serviceOf: serviceOf,
    rateOf: rateOf,
    servicesAt: servicesAt,
    hueOf: hueOf,
    expand: expand
  };
})();
