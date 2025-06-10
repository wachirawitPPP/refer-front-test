import { Card, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React from 'react'

const AllergyIntolerance = ({ formValues, setFormValues, isViewOnly }) => {
  const data = [
    {
      AL1_ALLERGY_REACTION:
        'ผื่นทั่วตัว(สงสัยยาจากคลินิก 3 รายการ 1.ยาเม็ดฟ้าขาว สงสัยเป็น paracetamol 2.ยาแคปซูลเหลืองแดงสงสัยเป็น amoxycillin 3.ยาเม็ดกลมเล็กสีขาวแก้ปวดท้องสงสัย buscopan)',
      AL1_ALLERGY_REACTIONCODE: '5114 UNKNOWN 1(มีประวัติแพ้ยาแต่ไม่ทราบชื่อยา)',
      AL1_DATETIME_UPDATE: '20140225120558',
      HOSPITALCODE_SOURCE: ' 14641',
      AL1_ALLERGYPROFILE: '3',
      SETID_AL1: '146415000182010001',
      AL1_IDENTIFICATION_DATE: '20071111080000',
      SETID_PID: '14641500018201'
    },
    {
      AL1_ALLERGY_REACTION: 'rash pruritus',
      AL1_ALLERGY_REACTIONCODE: '225 CEFTRIAXONE',
      AL1_DATETIME_UPDATE: '20240329090644',
      HOSPITALCODE_SOURCE: ' 14641',
      AL1_ALLERGYPROFILE: '1',
      SETID_AL1: '146416700210430001',
      AL1_IDENTIFICATION_DATE: '20240329090509',
      SETID_PID: '14641670021043'
    },
    {
      AL1_ALLERGY_REACTION:
        'ผื่นแดงคันทั้งตัวและแขน--บัตรข้อมูลซักประวัติย้อนหลัง"การแพ้ยา"รพ.สมุทรปราการ-ภญ.ฝนทิพ15/7/67',
      AL1_ALLERGY_REACTIONCODE: '-1 ไม่ระบุ',
      AL1_DATETIME_UPDATE: '20240715015624',
      HOSPITALCODE_SOURCE: ' 14641',
      AL1_ALLERGYPROFILE: '3',
      SETID_AL1: '146416700210430002',
      AL1_IDENTIFICATION_DATE: '20240715015320',
      SETID_PID: '14641670021043'
    },
    {
      AL1_ALLERGY_REACTION: 'ตาบวม',
      AL1_ALLERGY_REACTIONCODE: '897 PENICILLIN',
      AL1_DATETIME_UPDATE: '20240322014958',
      HOSPITALCODE_SOURCE: ' 14641',
      AL1_ALLERGYPROFILE: '3',
      SETID_AL1: '146416700253360001',
      AL1_IDENTIFICATION_DATE: '20240322014928',
      SETID_PID: '14641670025336'
    },
    {
      AL1_ALLERGY_REACTION: 'ปวดศีรษะ หมดสติ (ยาแก้อักเสบชนิดฉีด)',
      AL1_ALLERGY_REACTIONCODE: '5114 UNKNOWN 1(มีประวัติแพ้ยาแต่ไม่ทราบชื่อยา)',
      AL1_DATETIME_UPDATE: '20240828010432',
      HOSPITALCODE_SOURCE: ' 14641',
      AL1_ALLERGYPROFILE: '5',
      SETID_AL1: '146416700655690001',
      AL1_IDENTIFICATION_DATE: '20240828010214',
      SETID_PID: '14641670065569'
    },
    // More data...
  ];

  // Define table header fields
  const fields = [
    { label: 'รหัส', value: 'PROCEDURE_CODE' },
    { label: 'ชื่อสารก่อภูมิแพ้', value: 'AL1_ALLERGY_REACTIONCODE' },
    { label: 'รายละเอียด', value: 'AL1_ALLERGY_REACTION' },
    { label: 'อาการแพ้', value: 'AL1_ALLERGYPROFILE' },  // Allergy profile will be formatted using getAllergyProfile
    { label: 'วันที่ดำเนินการ', value: 'AL1_IDENTIFICATION_DATE' }
  ];

  const getAllergyProfile = profileCode => {
    switch (profileCode) {
      case '1':
        return 'แพ้';
      case '2':
        return 'ไม่แพ้';
      case '3':
        return 'ไม่ทราบ';
      default:
        return ' -';
    }
  };

  const formatDateTime = datetime => {
    if (!datetime) return '';

    const year = datetime.slice(0, 4);
    const month = datetime.slice(4, 6);
    const day = datetime.slice(6, 8);
    const hour = datetime.slice(8, 10);
    const minute = datetime.slice(10, 12);
    const second = datetime.slice(12, 14);

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  return (
    <Grid item xs={12} md={12} className="">
      <div style={{ maxHeight: '72vh', overflowY: 'auto' }}>
        <table className="w-full">
          <thead>
            <tr className="bg-primary">
              {/* Render table headers */}
              {fields.map((field, index) => (
                <th
                  key={index}
                  className="text-white bg-primary p-4"
                  style={{ position: 'sticky', top: 0, zIndex: 1 }}
                >
                  {field.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Render table rows dynamically based on the data */}
            {data.map((rowData, rowIndex) => (
              <tr key={rowIndex}>
                {fields.map((field, index) => (
                  <td key={index} className="border p-2">
                    {field.value === 'AL1_IDENTIFICATION_DATE'
                      ? formatDateTime(rowData[field.value])
                      : field.value === 'AL1_ALLERGYPROFILE'
                      ? getAllergyProfile(rowData[field.value]) // Use getAllergyProfile to format the profile field
                      : rowData[field.value] || ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Grid>
  );
};

export default AllergyIntolerance;
