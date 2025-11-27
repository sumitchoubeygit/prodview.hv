import { Manager, TL, LC, PerformanceStatus } from './types';

export const STATUS_THRESHOLDS = {
  POOR_LIMIT: 80,
  GOOD_START: 100,
};

export const getStatus = (overall: number): PerformanceStatus => {
  if (overall < STATUS_THRESHOLDS.POOR_LIMIT) return PerformanceStatus.POOR;
  if (overall > STATUS_THRESHOLDS.GOOD_START) return PerformanceStatus.GOOD;
  return PerformanceStatus.ACCEPTABLE;
};

// Helper to create LC object
const createLC = (
    nameEmail: string, 
    tl: string, 
    mgr: string, 
    att: string, 
    couns: number, 
    ud: number, 
    tt: number, 
    prod: number, 
    adm: number, 
    scr: number, 
    off: number, 
    ovr: number
): LC => {
    const [email] = nameEmail.split(' ');
    const name = email.split('@')[0].replace('.', ' ').replace(/[0-9]/g, ''); // Clean numbers from names
    
    // Calculate UD + TT dynamically to ensure consistency (some OCR data had weird percentage formatting)
    const calculatedUdPlusTt = Number((ud + tt).toFixed(2));

    return {
        id: email,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email,
        tlName: tl,
        managerName: mgr,
        metrics: {
            attendance: att,
            counselled: couns,
            uniqueDials: ud,
            talktime: tt,
            udPlusTt: calculatedUdPlusTt, 
            productivity: prod,
            admission: adm,
            screening: scr,
            offer: off,
            overall: ovr
        }
    };
};

// --- DATA POPULATION FROM OCR ---

// 1. Under Manager Avinash Kumar
// TL: Divya Singh
const tlDivya: TL = {
    name: "Divya Singh",
    managerName: "Avinash Kumar",
    metrics: { attendance: "6", counselled: 9, uniqueDials: 122.83, talktime: 87.46, udPlusTt: 210.29, productivity: 70.10, admission: 0, screening: 1.67, offer: 5.00, overall: 76.76 },
    lcs: [
        createLC("bipin.jaiswal@herovired.com", "Divya Singh", "Avinash Kumar", "Absent", 3, 69, 54.52, 41.17, 0, 0, 0, 41.17),
        createLC("pratham.meena@herovired.com", "Divya Singh", "Avinash Kumar", "Present", 2, 139, 74.8, 71.27, 0, 10, 10, 91.27),
        createLC("siddharth.gupta@herovired.com", "Divya Singh", "Avinash Kumar", "Absent", 1, 185, 59.57, 81.52, 0, 0, 0, 81.52),
        createLC("suraj@herovired.com", "Divya Singh", "Avinash Kumar", "Absent", 0, 0, 0, 0, 0, 0, 0, 0),
        createLC("tanzim.azad@herovired.com", "Divya Singh", "Avinash Kumar", "Absent", 1, 125, 117.93, 80.98, 0, 0, 0, 80.98),
        createLC("yuvraj.setia@herovired.com", "Divya Singh", "Avinash Kumar", "Present", 2, 172, 132.37, 101.46, 0, 0, 20, 121.46),
    ]
};

// TL: Kartik Choula
const tlKartik: TL = {
    name: "Kartik Choula",
    managerName: "Avinash Kumar",
    metrics: { attendance: "7", counselled: 17, uniqueDials: 112.29, talktime: 88.33, udPlusTt: 200.61, productivity: 66.87, admission: 0, screening: 0, offer: 10, overall: 76.87 },
    lcs: [
        createLC("archit.singh@herovired.com", "Kartik Choula", "Avinash Kumar", "Absent", 0, 116, 51.87, 55.96, 0, 0, 0, 55.96),
        createLC("harsh.mehra@herovired.com", "Kartik Choula", "Avinash Kumar", "Present", 4, 117, 132.03, 83.01, 0, 0, 10, 93.01),
        createLC("kartikey.chaurasiya@herovired.com", "Kartik Choula", "Avinash Kumar", "Absent", 2, 95, 118.8, 71.27, 0, 0, 10, 81.27),
        createLC("shivam.srivastava@herovired.com", "Kartik Choula", "Avinash Kumar", "Absent", 0, 68, 18.77, 28.92, 0, 0, 0, 28.92),
        createLC("simran.kumari@herovired.com", "Kartik Choula", "Avinash Kumar", "Present", 2, 174, 77.98, 83.99, 0, 0, 10, 93.99),
        createLC("sonam.sinha@herovired.com", "Kartik Choula", "Avinash Kumar", "Absent", 4, 131, 105.32, 78.77, 0, 0, 10, 88.77),
        createLC("yamini.upreti@herovired.com", "Kartik Choula", "Avinash Kumar", "Present", 5, 85, 113.52, 66.17, 0, 0, 30, 96.17),
    ]
};

// TL: Rohith Philip
const tlRohith: TL = {
    name: "Rohith Philip",
    managerName: "Avinash Kumar",
    metrics: { attendance: "5", counselled: 13, uniqueDials: 146.8, talktime: 115.31, udPlusTt: 262.11, productivity: 87.37, admission: 5, screening: 6, offer: 4, overall: 102.37 },
    lcs: [
        createLC("ayush.rathore@herovired.com", "Rohith Philip", "Avinash Kumar", "Present", 6, 150, 164.2, 104.73, 0, 0, 0, 104.73),
        createLC("deepak.kumar@herovired.com", "Rohith Philip", "Avinash Kumar", "Absent", 0, 0, 0, 0, 0, 0, 0, 0),
        createLC("rhythm.gandhi@herovired.com", "Rohith Philip", "Avinash Kumar", "Present", 3, 205, 101.38, 102.13, 0, 0, 0, 102.13),
        createLC("ruchika@herovired.com", "Rohith Philip", "Avinash Kumar", "Present", 3, 108, 189.57, 99.19, 0, 10, 10, 119.19),
        createLC("smriti.goyal@herovired.com", "Rohith Philip", "Avinash Kumar", "Present", 1, 115, 72.3, 62.43, 25, 10, 10, 107.43),
        createLC("sukhitha.s@herovired.com", "Rohith Philip", "Avinash Kumar", "Absent", 0, 0, 0, 0, 0, 0, 0, 0),
        createLC("surbhi.srivastava@herovired.com", "Rohith Philip", "Avinash Kumar", "Absent", 0, 0, 0, 0, 0, 0, 0, 0),
        createLC("utsav@herovired.com", "Rohith Philip", "Avinash Kumar", "Absent", 0, 156, 49.08, 68.36, 0, 10, 0, 78.36),
    ]
};

// 2. Under Manager Karan Mehta
// TL: Salony Purohit
const tlSalony: TL = {
    name: "Salony Purohit",
    managerName: "Karan Mehta",
    metrics: { attendance: "4", counselled: 13, uniqueDials: 97, talktime: 126.19, udPlusTt: 223.19, productivity: 74.40, admission: 0, screening: 2.5, offer: 2.5, overall: 79.40 },
    lcs: [
        createLC("divyanshu.kashyap@herovired.com", "Salony Purohit", "Karan Mehta", "Present", 6, 64, 226.38, 96.79, 0, 10, 0, 106.79),
        createLC("hradyesh.mishra@herovired.com", "Salony Purohit", "Karan Mehta", "Absent", 0, 107, 40.6, 49.20, 0, 0, 0, 49.20),
        createLC("priyanshu.tiwari@herovired.com", "Salony Purohit", "Karan Mehta", "Absent", 2, 134, 83, 72.33, 0, 0, 0, 72.33),
        createLC("sudhir.kumar@herovired.com", "Salony Purohit", "Karan Mehta", "Absent", 0, 0, 0, 0, 0, 0, 0, 0),
        createLC("vaibhav.sharma1@herovired.com", "Salony Purohit", "Karan Mehta", "Absent", 3, 83, 154.77, 79.26, 0, 0, 10, 89.26),
    ]
};

// TL: Amartya Singh
const tlAmartya: TL = {
    name: "Amartya Singh",
    managerName: "Karan Mehta",
    metrics: { attendance: "6", counselled: 12, uniqueDials: 87.83, talktime: 88.77, udPlusTt: 176.61, productivity: 58.87, admission: 4.17, screening: 5, offer: 3.33, overall: 71.37 },
    lcs: [
        createLC("manish.sharma@herovired.com", "Amartya Singh", "Karan Mehta", "Absent", 0, 22, 24.33, 15.44, 0, 0, 10, 25.44),
        createLC("namit.agrawal@herovired.com", "Amartya Singh", "Karan Mehta", "Absent", 2, 127, 108.15, 78.38, 0, 0, 0, 78.38),
        createLC("rahul.saluja@herovired.com", "Amartya Singh", "Karan Mehta", "Absent", 3, 52, 116.57, 56.19, 0, 10, 10, 76.19),
        createLC("rajnish.kumar@herovired.com", "Amartya Singh", "Karan Mehta", "Present", 1, 122, 74.27, 65.42, 25, 0, 0, 90.42),
        createLC("shubhanshu.srivastava@herovired.com", "Amartya Singh", "Karan Mehta", "Absent", 2, 125, 92.78, 72.59, 0, 0, 0, 72.59),
        createLC("vasu.narang@herovired.com", "Amartya Singh", "Karan Mehta", "Absent", 4, 79, 116.53, 65.18, 0, 20, 0, 85.18),
    ]
};

// TL: Pushpendra Shekhawat
const tlPushpendra: TL = {
    name: "Pushpendra Shekhawat",
    managerName: "Karan Mehta",
    metrics: { attendance: "5", counselled: 11, uniqueDials: 82.4, talktime: 79.33, udPlusTt: 161.73, productivity: 53.91, admission: 10, screening: 4, offer: 8, overall: 75.91 },
    lcs: [
        createLC("amogh.saxena@herovired.com", "Pushpendra Shekhawat", "Karan Mehta", "Absent", 2, 147, 82.35, 76.45, 0, 0, 10, 86.45),
        createLC("m.shivamani@herovired.com", "Pushpendra Shekhawat", "Karan Mehta", "Present", 3, 123, 92.97, 71.99, 25, 10, 10, 116.99),
        createLC("mohammad.tariq@herovired.com", "Pushpendra Shekhawat", "Karan Mehta", "Absent", 0, 71, 62.92, 44.64, 0, 0, 0, 44.64),
        createLC("nishant.kumar1@herovired.com", "Pushpendra Shekhawat", "Karan Mehta", "Present", 6, 35, 150.13, 61.71, 25, 10, 20, 116.71),
    ]
};

// 3. Under Manager Narender Sharma
// TL: Muskan Gaba
const tlMuskan: TL = {
    name: "Muskan Gaba",
    managerName: "Narender Sharma",
    metrics: { attendance: "8", counselled: 8, uniqueDials: 112, talktime: 55.35, udPlusTt: 167.35, productivity: 55.78, admission: 3.13, screening: 1.25, offer: 2.50, overall: 62.66 },
    lcs: [
        createLC("abhishek.mishra2@herovired.com", "Muskan Gaba", "Narender Sharma", "Absent", 2, 151, 95.75, 82.25, 0, 0, 0, 82.25),
        createLC("aditya.vatsa@herovired.com", "Muskan Gaba", "Narender Sharma", "Absent", 0, 154, 26.77, 60.26, 0, 0, 0, 60.26),
        createLC("garima.verma@herovired.com", "Muskan Gaba", "Narender Sharma", "Absent", 1, 166, 51.8, 72.60, 0, 0, 0, 72.60),
        createLC("jai.singh@herovired.com", "Muskan Gaba", "Narender Sharma", "Absent", 1, 131, 50.55, 60.52, 25, 0, 0, 85.52),
        createLC("mrinal.mehra@herovired.com", "Muskan Gaba", "Narender Sharma", "Absent", 0, 112, 28.33, 46.78, 0, 0, 0, 46.78),
        createLC("pushkar@herovired.com", "Muskan Gaba", "Narender Sharma", "Absent", 1, 68, 80, 49.33, 0, 10, 20, 79.33),
        createLC("sneha.yadav@herovired.com", "Muskan Gaba", "Narender Sharma", "Absent", 2, 102, 82.78, 61.59, 0, 0, 0, 61.59),
        createLC("vivek.raj@herovired.com", "Muskan Gaba", "Narender Sharma", "Absent", 0, 12, 26.78, 12.93, 0, 0, 0, 12.93),
    ]
};

// TL: Sarthak Sharma
const tlSarthak: TL = {
    name: "Sarthak Sharma",
    managerName: "Narender Sharma",
    metrics: { attendance: "9", counselled: 18, uniqueDials: 99.22, talktime: 68.01, udPlusTt: 167.23, productivity: 55.74, admission: 0, screening: 1.11, offer: 3.33, overall: 60.19 },
    lcs: [
        createLC("anas.h@herovired.com", "Sarthak Sharma", "Narender Sharma", "Absent", 2, 95, 45.42, 46.81, 0, 0, 0, 46.81),
        createLC("harshitha.b@herovired.com", "Sarthak Sharma", "Narender Sharma", "Absent", 0, 119, 47.55, 55.52, 0, 0, 0, 55.52),
        createLC("j.krishnanunni@herovired.com", "Sarthak Sharma", "Narender Sharma", "Absent", 2, 103, 36.8, 46.60, 0, 0, 0, 46.60),
        createLC("latha.r@herovired.com", "Sarthak Sharma", "Narender Sharma", "Absent", 0, 75, 70.28, 48.43, 0, 0, 0, 48.43),
        createLC("mohammed.shoib@herovired.com", "Sarthak Sharma", "Narender Sharma", "Absent", 3, 104, 53.32, 52.44, 0, 0, 10, 62.44),
        createLC("momin.rafiya@herovired.com", "Sarthak Sharma", "Narender Sharma", "Absent", 0, 101, 30.85, 43.95, 0, 10, 0, 53.95),
        createLC("nikitha@herovired.com", "Sarthak Sharma", "Narender Sharma", "Absent", 4, 90, 107.18, 65.73, 0, 0, 10, 75.73),
        createLC("shivani.singh@herovired.com", "Sarthak Sharma", "Narender Sharma", "Absent", 4, 86, 136.08, 74.03, 0, 0, 10, 84.03),
        createLC("swapna.jayasankar@herovired.com", "Sarthak Sharma", "Narender Sharma", "Absent", 3, 120, 84.57, 68.19, 0, 0, 0, 68.19),
    ]
};

// 4. Under Manager Anshul Kumar (who manages himself/his own team)
// TL: Anshul Kumar
const tlAnshul: TL = {
    name: "Anshul Kumar",
    managerName: "Anshul Kumar",
    metrics: { attendance: "3", counselled: 11, uniqueDials: 72.67, talktime: 57.37, udPlusTt: 130.03, productivity: 43.34, admission: 8.33, screening: 3.33, offer: 6.67, overall: 61.68 },
    lcs: [
        createLC("bharati.sawaikar@herovired.com", "Anshul Kumar", "Anshul Kumar", "Absent", 4, 85, 112.17, 65.72, 0, 10, 0, 75.72),
        createLC("deepshikha.anuragi2@herovired.com", "Anshul Kumar", "Anshul Kumar", "Absent", 0, 25, 12.08, 12.36, 0, 0, 0, 12.36),
        createLC("fatima.ali@herovired.com", "Anshul Kumar", "Anshul Kumar", "Absent", 2, 108, 47.85, 51.95, 0, 0, 10, 61.95),
        createLC("sayuri.jadhav@herovired.com", "Anshul Kumar", "Anshul Kumar", "Absent", 0, 0, 0, 0, 0, 0, 0, 0),
        createLC("sneha.rokade@herovired.com", "Anshul Kumar", "Anshul Kumar", "Absent", 0, 0, 0, 0, 0, 0, 0, 0),
    ]
};

// Managers
const mgrAvinash: Manager = {
    name: "Avinash Kumar",
    metrics: { attendance: "18", counselled: 39, uniqueDials: 125.39, talktime: 95.53, udPlusTt: 220.92, productivity: 73.64, admission: 1.39, screening: 2.22, offer: 6.67, overall: 83.92 },
    tls: [tlDivya, tlKartik, tlRohith]
};

const mgrKaran: Manager = {
    name: "Karan Mehta",
    metrics: { attendance: "15", counselled: 36, uniqueDials: 88.47, talktime: 95.6, udPlusTt: 184.07, productivity: 61.36, admission: 5.00, screening: 4.00, offer: 4.67, overall: 75.02 },
    tls: [tlAmartya, tlPushpendra, tlSalony]
};

const mgrNarender: Manager = {
    name: "Narender Sharma",
    metrics: { attendance: "17", counselled: 26, uniqueDials: 105.24, talktime: 62.05, udPlusTt: 167.28, productivity: 55.76, admission: 1.47, screening: 1.18, offer: 2.94, overall: 61.35 },
    tls: [tlMuskan, tlSarthak]
};

const mgrAnshul: Manager = {
    name: "Anshul Kumar",
    metrics: { attendance: "3", counselled: 11, uniqueDials: 72.67, talktime: 57.37, udPlusTt: 130.03, productivity: 43.34, admission: 8.33, screening: 3.33, offer: 6.67, overall: 61.68 },
    tls: [tlAnshul]
};

export const MANAGERS_DATA: Manager[] = [mgrAvinash, mgrKaran, mgrNarender, mgrAnshul];

// Flattening for searching/listing
export const ALL_TLS: TL[] = MANAGERS_DATA.flatMap(m => m.tls);
export const ALL_LCS: LC[] = ALL_TLS.flatMap(t => t.lcs);