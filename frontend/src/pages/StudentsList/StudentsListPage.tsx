import {
  Box,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Table,
  Paper,
  CircularProgress,
  InputAdornment,
  TextField,
  TableSortLabel,
  Button,
} from "@mui/material";
import { useOnMount } from "hooks";
import React, { useState, useRef, Fragment, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getProjectInfo,
  Student,
  ProfProjectInfoResponse,
  Project,
  leaveGroup,
} from "api";
import { useMutation } from "@tanstack/react-query";
import { CopyIcon } from "pages/CreateProject/components/CopyIcon";

export const StudentsListPage: React.FC = () => {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState("");
  const [endDate, setEndDate] = useState<Date>(new Date());
  const projectIdRef = useRef(projectId);
  const [searchParams, setSearchParams] = useSearchParams();
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [order, setOrder] = useState<"asc" | "desc" | undefined>("asc");
  const [project, setProject] = useState<Project>({
    project_name: "",
    min_group_size: -1,
    max_group_size: -1,
    join_code: "",
    end_date: "",
    description: "",
    professor: {
      name: "",
      user_type: "professor",
      uuid: "",
    },
  });
  const today = new Date();
  const kickFromGroupMuation = useMutation(leaveGroup, {
    onError: () => {
      setError(true);
      setErrorMessage("Failed to kick");
    },
    onSuccess: () => {
      getStudentListMutation.mutate(projectId);
    },
  });

  const getStudentListMutation = useMutation(getProjectInfo, {
    onError: () => {
      navigate("/projects");
    },
    onSuccess: (data) => {
      setStudentList((data as ProfProjectInfoResponse).students);
      setProject((data as ProfProjectInfoResponse).project);
      setEndDate(new Date(data.project.end_date));
    },
  });

  useOnMount(() => {
    setProjectId(searchParams.get("project_id")!);
    projectIdRef.current = searchParams.get("project_id")!;
    const nav = setTimeout(() => {
      if (projectIdRef.current === "") {
        navigate("/projects");
      }
    }, 500);
    return () => {
      clearTimeout(nav);
    };
  });

  useEffect(() => {
    if (projectId !== "") {
      getStudentListMutation.mutate(projectId);
    }
  }, [projectId]);

  const handelSort = (): void => {
    setOrder(order === "asc" ? "desc" : "asc");
  };

  const sortAsc = (a: Student, b: Student): number => {
    if (a.group_name === "") return 1;
    if (b.group_name === "") return -1;
    if (a.group_name < b.group_name) return -1;
    if (a.group_name > b.group_name) return 1;
    return 0;
  };

  const sortDesc = (a: Student, b: Student): number => {
    if (a.group_name === "") return 1;
    if (b.group_name === "") return -1;
    if (a.group_name < b.group_name) return 1;
    if (a.group_name > b.group_name) return -1;
    return 0;
  };

  const kickFromGroup = (uuid: string): void => {
    kickFromGroupMuation.mutate({
      project_id: projectId,
      request: { uuid: uuid },
    });
  };

  return (
    <Box
      display="flex"
      flexDirection={"column"}
      maxWidth={600}
      alignItems="center"
      justifyContent={"center"}
      margin="auto"
      maxHeight={600}
    >
      {getStudentListMutation.isLoading ? (
        <Fragment>
          <CircularProgress size={100} />
        </Fragment>
      ) : (
        <Fragment>
          <Typography paddingBottom={3} variant="h5">
            Students In Your Project
          </Typography>
          <Typography variant="h5">Join Code:</Typography>
          <TextField
            sx={{ padding: 2 }}
            defaultValue={projectId}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <CopyIcon {...{ toCopy: projectId }} />
                </InputAdornment>
              ),
            }}
          />
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 400 }}
              aria-label="simple table"
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={true}
                      direction={order}
                      onClick={handelSort}
                    >
                      Group Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Kick From Group</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentList
                  .sort(order === "asc" ? sortAsc : sortDesc)
                  .map((student) => (
                    <TableRow key={student.uuid}>
                      <TableCell align="center">{student.name}</TableCell>
                      <TableCell align="center">{student.email}</TableCell>
                      <TableCell align="center">
                        {student.group_name === "" ? (
                          <Typography>-</Typography>
                        ) : (
                          <Typography>{student.group_name}</Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          disabled={
                            student.group_name === "" || today > endDate
                          }
                          onClick={() => kickFromGroup(student.uuid)}
                        >
                          Kick
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          {error && (
            <Typography sx={{ color: "red", textAlign: "center" }}>
              {errorMessage}
            </Typography>
          )}
        </Fragment>
      )}
    </Box>
  );
};
