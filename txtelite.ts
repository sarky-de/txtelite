let pairs0: string =
    "ABOUSEITILETSTONLONUTHNOALLEXEGEZACEBISOUSESARMAINDIREA.ERATENBERALAVETIEDORQUANTEISRION";

let pairs: string = "..LEXEGEZACEBISO"
                  + "USESARMAINDIREA."
                  + "ERATENBERALAVETI"
                  + "EDORQUANTEISRION";

const govnames: string[] = [
    "Anarchy", "Feudal", "Multi-gov", "Dictatorship",
    "Communist", "Confederacy", "Democracy", "Corporate State"
];

const econnames: string[] = [
    "Rich Ind", "Average Ind", "Poor Ind", "Mainly Ind",
    "Mainly Agri", "Rich Agri", "Average Agri", "Poor Agri"
];

const unitnames: string[] = ["t", "kg", "g"];
                
class FastSeedType {
    a: number;
    b: number;
    c: number;
    d: number;

    constructor(a: number, b: number, c: number, d: number) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }
}

class SeedType {
    w0: number;
    w1: number;
    w2: number;

    constructor(w0: number, w1: number, w2: number) {
        this.w0 = w0;
        this.w1 = w1;
        this.w2 = w2;
    }
}

class PlanSys {
    x: number;
    y: number;
    economy: number;
    govtype: number;
    techlev: number;
    population: number;
    productivity: number;
    radius: number;
    goatsoupseed: FastSeedType;
    name: string;

    constructor(x: number, y: number, economy: number, govtype: number, techlev: number, population: number, productivity: number, radius: number, goatsoupseed: FastSeedType, name: string) {
        this.x = x;
        this.y = y;
        this.economy = economy;
        this.govtype = govtype;
        this.techlev = techlev;
        this.population = population;
        this.productivity = productivity;
        this.radius = radius;
        this.goatsoupseed = goatsoupseed;
        this.name = name;
    }
}

interface MarketType {
    quantity: number[];
    price: number[];
}

interface TradeGood {
    gradient: number;
    baseprice: number;
    basequant: number;
    maskbyte: number;
    units: number;
    name: string;
}

const commodities: TradeGood[] = [
    { gradient: 0x13, baseprice: -0x02, basequant: 0x06, maskbyte: 0x01, units: 0, name: "Food" },
    { gradient: 0x14, baseprice: -0x01, basequant: 0x0A, maskbyte: 0x03, units: 0, name: "Textiles" },
    { gradient: 0x41, baseprice: -0x03, basequant: 0x02, maskbyte: 0x07, units: 0, name: "Radioactives" },
    { gradient: 0x28, baseprice: -0x05, basequant: 0xE2, maskbyte: 0x1F, units: 0, name: "Slaves" },
    { gradient: 0x53, baseprice: -0x05, basequant: 0xFB, maskbyte: 0x0F, units: 0, name: "Liquor/Wines" },
    { gradient: 0xC4, baseprice: +0x08, basequant: 0x36, maskbyte: 0x03, units: 0, name: "Luxuries" },
    { gradient: 0xEB, baseprice: +0x1D, basequant: 0x08, maskbyte: 0x78, units: 0, name: "Narcotics" },
    { gradient: 0x9A, baseprice: +0x0E, basequant: 0x38, maskbyte: 0x03, units: 0, name: "Computers" },
    { gradient: 0x75, baseprice: +0x06, basequant: 0x28, maskbyte: 0x07, units: 0, name: "Machinery" },
    { gradient: 0x4E, baseprice: +0x01, basequant: 0x11, maskbyte: 0x1F, units: 0, name: "Alloys" },
    { gradient: 0x7C, baseprice: +0x0d, basequant: 0x1D, maskbyte: 0x07, units: 0, name: "Firearms" },
    { gradient: 0xB0, baseprice: -0x09, basequant: 0xDC, maskbyte: 0x3F, units: 0, name: "Furs" },
    { gradient: 0x20, baseprice: -0x01, basequant: 0x35, maskbyte: 0x03, units: 0, name: "Minerals" },
    { gradient: 0x61, baseprice: -0x01, basequant: 0x42, maskbyte: 0x07, units: 1, name: "Gold" },
    { gradient: 0xAB, baseprice: -0x02, basequant: 0x37, maskbyte: 0x1F, units: 1, name: "Platinum" },
    { gradient: 0x2D, baseprice: -0x01, basequant: 0xFA, maskbyte: 0x0F, units: 2, name: "Gem-Stones" },
    { gradient: 0x35, baseprice: +0x0F, basequant: 0xC0, maskbyte: 0x07, units: 0, name: "Alien Items" }
];

const base0: number = 0x5A4A;
const base1: number = 0x0248;
const base2: number = 0xB753;

const galsize: number = 256;
const AlienItems: number = 16;
const lasttrade: number = AlienItems;

const numforLave: number = 7;

let shipshold: number[] = [];

function tweakSeed(s: SeedType): void {
    let temp: number;
    temp = s.w0 + s.w1 + s.w2;
    s.w0 = s.w1;
    s.w1 = s.w2;
    s.w2 = temp;
}

function stripOut(s: string, c: string): string {
    let result = '';
    for (let i = 0; i < s.length; i++) {
        if (s[i] !== c) {
            result += s[i];
        }
    }
    return result;
}

function makeSystem(s: SeedType): PlanSys {
    let thisSys = new PlanSys(0, 0, 0, 0, 0, 0, 0, 0, new FastSeedType(0, 0, 0, 0), "");
    let longNameFlag = s.w0 & 64;

    thisSys.x = s.w1 >> 8;
    thisSys.y = s.w0 >> 8;

    thisSys.govtype = (s.w1 >> 3) & 7;
    thisSys.economy = (s.w0 >> 8) & 7;
    if (thisSys.govtype <= 1) {
        thisSys.economy |= 2;
    }

    thisSys.techlev = ((s.w1 >> 8) & 3) + (thisSys.economy ^ 7);
    thisSys.techlev += thisSys.govtype >> 1;
    if (thisSys.govtype & 1) {
        thisSys.techlev += 1;
    }

    thisSys.population = 4 * thisSys.techlev + thisSys.economy;
    thisSys.population += thisSys.govtype + 1;

    thisSys.productivity = ((thisSys.economy ^ 7) + 3) * (thisSys.govtype + 4);
    thisSys.productivity *= thisSys.population * 8;

    thisSys.radius = 256 * (((s.w2 >> 8) & 15) + 11) + thisSys.x;

    thisSys.goatsoupseed.a = s.w1 & 0xFF;
    thisSys.goatsoupseed.b = s.w1 >> 8;
    thisSys.goatsoupseed.c = s.w2 & 0xFF;
    thisSys.goatsoupseed.d = s.w2 >> 8;

    // Generate name using pairs
    let name = '';
    let pairIndices: number[] = [];
    for (let i = 0; i < (longNameFlag ? 4 : 3); i++) {
        let pairIndex: number = 2 * ((s.w2 >> 8) & 31);
        tweakSeed(s);
        pairIndices.push(pairIndex);
    }

    for (let index of pairIndices) {
        name += pairs[index] + pairs[index + 1];
    }

    thisSys.name = stripOut(name, '.');

    return thisSys;
}

function rotateL(x: number): number {
    let temp = x & 128;
    return (2 * (x & 127)) + (temp >> 7);
}

function twist(x: number): number {
    return (256 * rotateL(x >> 8)) + rotateL(x & 255);
}

function nextGalaxy(s: SeedType): void {
    s.w0 = twist(s.w0);
    s.w1 = twist(s.w1);
    s.w2 = twist(s.w2);
}

let galaxy: PlanSys[] = new Array(galsize);

function buildGalaxy(galaxyNum: number): void {
    let baseSeed = new SeedType(base0, base1, base2);
    for (let galCount = 1; galCount < galaxyNum; ++galCount) {
        nextGalaxy(baseSeed);
    }
    for (let sysCount = 0; sysCount < galsize; ++sysCount) {
        galaxy[sysCount] = makeSystem(baseSeed);
    }
}

function priSys(plsy: PlanSys, compressed: boolean): void {
    let output = '';
    
    if (compressed) {
        output += `${plsy.name} `;
        output += `TL: ${(plsy.techlev + 1).toString()} `;
        output += `${econnames[plsy.economy]} `;
        output += `${govnames[plsy.govtype]}\n`;
    } else {
        output += `\n\nSystem: ${plsy.name}`;
        output += `\nPosition (${plsy.x}, ${plsy.y})`;
        output += `\nEconomy: (${plsy.economy}) ${econnames[plsy.economy]}`;
        output += `\nGovernment: (${plsy.govtype}) ${govnames[plsy.govtype]}`;
        output += `\nTech Level: ${plsy.techlev + 1}`;
        output += `\nTurnover: ${plsy.productivity}`;
        output += `\nRadius: ${plsy.radius}`;
        output += `\nPopulation: ${plsy.population >> 3} Billion`;
    }

    console.log(output);
}

function genMarket(fluct: number, p: PlanSys): MarketType {
    let market: MarketType = { quantity: new Array(commodities.length), price: new Array(commodities.length) };

    for (let i = 0; i <= lasttrade; i++) {
        let q: number;
        let product = p.economy * commodities[i].gradient;
        let changing = fluct & commodities[i].maskbyte;
        q = commodities[i].basequant + changing - product;
        q = q & 0xFF;
        if (q & 0x80) q = 0;

        market.quantity[i] = q & 0x3F;

        q = commodities[i].baseprice + changing + product;
        q = q & 0xFF;
        market.price[i] = q * 4;
    }

    market.quantity[AlienItems] = 0;
    return market;
}

function displayMarket(m: MarketType): void {
    for (let i = 0; i <= lasttrade; i++) {
        let output = `\n${commodities[i].name}   ${(m.price[i] / 10).toFixed(1)}   ${m.quantity[i]}${unitnames[commodities[i].units]}   ${shipshold[i]}`;
        console.log(output);
    }
}

buildGalaxy(1);
priSys(galaxy[0], false);

let currentplanet = numforLave;
let localmarket = genMarket(0x00, galaxy[numforLave]);
displayMarket(localmarket);