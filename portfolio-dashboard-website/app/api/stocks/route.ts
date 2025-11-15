import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function GET() {
  try {

    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
      key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY!.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID!, auth);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    await sheet.loadCells();

    const rowCount = sheet.rowCount;

    const data = [];

    for (let i = 1; i < rowCount; i++) {
      
      const company = sheet.getCell(i, 0).value;
      const sector = sheet.getCell(i, 1).value;
      const ticker = sheet.getCell(i, 2).value;
      const pe = sheet.getCell(i, 3).value;
      const eps = sheet.getCell(i, 4).value;

      if (!company) continue;

      data.push({
        company,
        sector,
        ticker,
        pe,
        eps,
      });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Sheets API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
