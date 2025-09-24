import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";

export default function PeopleTable(){
  return (
    <div id="wd-people-table">
      <Table striped>
        <thead>
          <tr><th>Name</th><th>Login ID</th><th>Section</th><th>Role</th><th>Last Activity</th><th>Total Activity</th></tr>
        </thead>
        <tbody>
          {[
            {first:"Tony", last:"Stark", id:"001234561S", sec:"S101", role:"STUDENT", lastAct:"2020-10-01", total:"10:21:32"},
            {first:"Bruce", last:"Wayne", id:"001234562B", sec:"S101", role:"TA", lastAct:"2020-10-02", total:"05:12:12"},
            {first:"Natasha", last:"Romanoff", id:"001234563N", sec:"S101", role:"STUDENT", lastAct:"2020-10-03", total:"12:45:09"}
          ].map((u, i)=>(
            <tr key={i}>
              <td className="wd-full-name text-nowrap">
                <FaUserCircle className="me-2 fs-1 text-secondary"/>
                <span className="wd-first-name">{u.first}</span>{" "}
                <span className="wd-last-name">{u.last}</span>
              </td>
              <td className="wd-login-id">{u.id}</td>
              <td className="wd-section">{u.sec}</td>
              <td className="wd-role">{u.role}</td>
              <td className="wd-last-activity">{u.lastAct}</td>
              <td className="wd-total-activity">{u.total}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
