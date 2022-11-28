const { Grade } = require("../dataModel/gradesModel");
const { Report, validateReport } = require("../dataModel/reportModal");
const { Student } = require("../dataModel/studentsModel");
const { StudentTestResult } = require("../dataModel/studentTestResultModel");
const { Test } = require("../dataModel/testsModel");
const { UserRole } = require("../dataModel/userRolesModel");
const sendMail = require("../NodeMailer/sendMail");
const router = require("express").Router();

router.get("/", async (req, res) => {
  const reports = await Report.find();
  if (!reports) {
    return res.status(404).send("reports not found");
  }
  res.status(200).send(reports);
});

router.post("/countreports", async (req, res) => {
  const totalNoOfReports = await Report.find().count();
  return res.status(200).send(totalNoOfReports + "");
});

router.post("/pfs", async (req, res) => {
  const { currentPage, pageSize, firstName, rollNumber } = req.body;
  const skip = (currentPage - 1) * pageSize;
  const limit = pageSize;
  let query = {};

  if (firstName) {
    query["student.firstName"] = firstName;
  }
  if (rollNumber) {
    query["student.rollNumber"] = rollNumber;
  }
  const reports = await Report.find(query).limit(limit).skip(skip);
  if (!reports) {
    return res.status(404).send("reports not found");
  }
  res.status(200).send(reports);
});

router.post("/sendreport", async (req, res) => {
  const report = await Report.findById(req.body.id);
  let totalObtainedMarks = report.marks.reduce((prev, curr) => prev + curr);
  const totalMarks = report.marks.length * report.total;
  const percentage = (totalObtainedMarks / totalMarks) * 100;
  console.log(report);
  const html = `
  <head>
    
    <style>
      h1 {
        box-shadow:10px 10px black;
        font-size: 30px;
        text-transform: uppercase;
        font-weight: 300;
        text-align: center;
        margin-bottom: 15px;
      }
      table {
        width: 100%;
        table-layout: fixed;
        border: 2px solid;
      }
      .tbl-header {
        display: inline;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.3);
      }
      .tbl-content {
        width: 100%;
        display: inline;
        height: 300px;
        overflow-x: auto;
        margin-top: 0px;
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      th {
        padding: 20px 15px;
        text-align: middle;
        font-weight: 500;
        font-size: 12px;
        text-transform: uppercase;
      }
      td {
        padding: 15px;
        text-align: center;
        vertical-align: middle;
        font-weight: 300;
        font-size: 12px;
        border-bottom: solid 1px rgba(255, 255, 255, 0.1);
      }

    
      .total {
        display: flex;
        height: 90px;
        width: 90px;
        border: 4px solid;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        font-weight: bold;
      }
      .container {
        width: 100%;
      }
      .abc {
        display: flex;
        justify-content: center;
        margin-top: 30px;
        font-size: 20px;
        /* margin-left: 70px;
        width: 20%; */
      }
      .qwe {
        margin-right: 35px;
      }
      .asd {
        margin-left: 10px;
        font-size: 20px;
        font-weight: 900;
      }
      .name {
        margin-bottom: 10px;
        border-bottom: 1px solid;
      }
      .stddiv {
        margin-bottom: 10px;
      }
    </style>
  </head>
  <body>
    <section>
      <div class="container">
        <h1 style="box-shadow: 10px 10px lightblue;">Report Card</h1>
        <div class="name">
          <label for="">NAME : ${
            report.student.firstName +
            " " +
            report.student.middleName +
            " " +
            report.student.lastName
          }</label>
          
        </div>
        <div class="stddiv">
          <label for="">STANDARD :${report.student.standard.standard} </label>
        </div>
        <div class="stddiv">
          <label for="">DIVISION : ${report.student.division.division} </label>
        </div>
        <div class="stddiv">
          <label for="">TEST :${report.testName} </label>
        </div>
        <div class="tbl-header">
          <table cellpadding="0" cellspacing="0">
            <thead>
              <tr>
                <th>SR.NO</th>
                <th>Subjects</th>
                <th>Marks</th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="tbl-content">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td>1</td>
                <td>${report.subjects[0]}</td>
                <td>${report.marks[0]}</td>
              </tr>
              <tr>
                <td>2</td>
                <td>${report.subjects[1]}</td>
                <td>${report.marks[1]}</td>
              </tr>
              <tr>
                <td>3</td>
                <td>${report.subjects[2]}</td>
                <td>${report.marks[2]}</td>
              </tr>
              <tr>
                <td>4</td>
                <td>${report.subjects[3]}</td>
                <td>${report.marks[3]}</td>
              </tr>
              <tr>
                <td>5</td>
                <td>${report.subjects[4]}</td>
                <td>${report.marks[4]}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="abc">
        <div class="qwe">
        Total : ${totalObtainedMarks + "/" + totalMarks}
         
        </div>
        <div class="qwe">
        Percentage : ${percentage + "%"}
          
        </div>
        <div class="qwe">
        Grade : ${percentage < 50 ? "FAIL" : report.obtainedGrade.grade}
          
        </div>
      </div>
      <div class="abc">
     Remark : ${report.remark}
      </div>
    </section>
  </body>`;
  sendMail(report.student.parents.email, "report", html);
  res.status(200).send(req.body.id);
});

router.post("/:userId", async (req, res) => {
  const { error } = validateReport(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const userRoles = await UserRole.find();
  const classTeacher = userRoles.find((ur) => ur.user._id == req.params.userId);

  const student = await Student.findById(req.body.student);
  if (
    !student ||
    !(
      student.standard.standard == classTeacher.standard.standard &&
      student.division.division == classTeacher.division.division
    )
  ) {
    return res.status(404).send("student not found");
  }

  const subjects = [];
  const marks = [];
  let total;
  let query1 = {};
  let query2 = {};

  query1["student.standard.standard"] = classTeacher.standard.standard;
  query2["student.division.division"] = classTeacher.division.division;

  const testResults = await StudentTestResult.find({ $and: [query1, query2] });
  testResults.map((result) => {
    if (
      result.student._id.toString() == student._id.toString() &&
      result.test.testName == req.body.testName
    ) {
      subjects.push(result.test.subject.subject);
      marks.push(result.obtainedMarks);
      total = result.test.totalMarks;
    }
  });

  const grades = await Grade.find();
  let totalObtainedMarks = marks.reduce((prev, curr) => prev + curr);
  const totalMarks = marks.length * total;
  const percentage = (totalObtainedMarks / totalMarks) * 100;
  const grade = grades.find((g) => percentage > g.start && percentage <= g.end);
  console.log(grade);
  const report = new Report({
    student: student,
    testName: req.body.testName,
    subjects: subjects,
    marks: marks,
    total: total,
    obtainedGrade: grade,
  });

  await report.save();
  res.status(200).send(report);
});

router.patch("/:id", async (req, res) => {
  const report = await Report.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        remark: req.body.remark,
      },
    },
    { new: true }
  );
  res.status(200).send(report);
});

router.delete("/:id", async (req, res) => {
  console.log(req.params.id);
  const report = await Report.findByIdAndDelete(req.params.id);
  if (!report) {
    return res.status(404).send("report not found");
  }
  res.status(200).send(report);
});

module.exports = router;
