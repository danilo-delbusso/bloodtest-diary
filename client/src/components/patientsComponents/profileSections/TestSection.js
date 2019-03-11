import React from "react";
import styled from "styled-components";
import InfoCell from "./profileCells/InfoCell";
import InputCell from "./profileCells/InputCell";
import TestCell from "./profileCells/TestCell";
import Label from "./profileCells/Label";

const Container = styled.div`
  margin: 3%;
  padding: 1%;
  //border: #839595 3px solid;
  //border-radius: 10px;`;


const Line = styled.hr`
  border: 0;
  border-bottom: solid 1px rgb(100, 100, 100, 0.5);
`;

const Field = styled.div`
  position: relative;
  padding-left: 1%;
  width: 30%;
  min-width: 10%;
  margin: 0 2.5%;
  height: 100%;
  color: inherit;
  font-family: "Rajdhani", sans-serif;
  font-size: 200%;
  overflow: scroll;
  display:flex;
  align-items:center;;
`;

const Horizontal = styled.div`
    display: flex;
`;


export default class PatientSection extends React.Component {


    render() {
        return (
            <>
                <Container>
                    <Label>Next tests</Label>
                    <Line />
                    <Horizontal>
                        <Field>Due</Field>
                        <Field>Notes</Field>
                    </Horizontal>
                    {this.props.tests.map(test => (
                        <TestCell
                            key={test.test_no}
                            due = {test.due_date}
                            notes={test.notes}
                        />
                    ))}
                </Container>
            </>
        );
    }
}