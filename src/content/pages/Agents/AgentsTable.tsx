import {
  FC,
  ChangeEvent,
  useState,
  useCallback,
  useContext,
  useEffect,
} from "react";
import {
  Divider,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
  useTheme,
  CardHeader,
  Button,
  CircularProgress,
} from "@mui/material";

import { AgentContext, IAgent } from "src/contexts/AgentContext";
import { AuthContext } from "src/contexts/AuthContext";
import { TabsContext } from "src/contexts/TabsContext";
import Label from "src/components/Label";
import { agentService } from "src/services/agent.service";
import { useTranslation } from "react-i18next";
import ModalButton from "src/components/ModalButton";
import UpdateAgentForm from "./UpdateAgentForm";
import Swal from "sweetalert2";
import { getAxiosErrorMessage } from "src/lib";
import ConfirmModal from "src/components/ConfirmModal";

const headCells = [
  { id: "name", label: "name" },
  { id: "phone_number", label: "phoneNumber" },
  { id: "email", label: "email" },
  { id: "status", label: "status" },
];

const applyPagination = (agents: IAgent[], page: number, limit: number) => {
  return agents.slice(page * limit, page * limit + limit);
};

const AgentTable: FC<{ agents }> = ({ agents: agentData }) => {
  const { t } = useTranslation();
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const context = useContext(AgentContext);
  const tabsContext = useContext(TabsContext);

  const { getAgents } = context.handleAgents;
  const { setLoading, loading } = context.handleLoading;

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const {
    handleTabs: { setTabsData },
  } = tabsContext;

  useEffect(() => {
    setPage(0);
  }, [agentData]);

  const getStatusLabel = (status: 0 | 1) => {
    const map = {
      1: {
        text: "enabled",
        color: "success",
      },
      0: {
        text: "disabled",
        color: "error",
      },
    };

    const { text, color }: any = map[status];

    return <Label color={color}>{t(text)}</Label>;
  };

  const changeStatus = useCallback(
    async (status: "enable" | "disable") => {
      try {
        setLoading(true);
        await agentService.changeStatus(selectedAgents, status);
        await getAgents();
      } catch (error) {}
    },
    [selectedAgents]
  );

  const handleSelectAll = (event) => {
    const res = event.target.checked ? agentData.map((item) => item.email) : [];
    setSelectedAgents(res);
    setTabsData(res);
  };

  const handleSelectOne = (event, agentEmail: string): void => {
    if (!selectedAgents.includes(agentEmail)) {
      const res = [...selectedAgents, agentEmail];
      setSelectedAgents(res);
      setTabsData(res);
    } else {
      const res = selectedAgents.filter((id) => id !== agentEmail);
      setSelectedAgents(res);
      setTabsData(res);
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: any): void => {
    setLimit(parseInt(event.target.value));
    setPage(0);
  };

  const paginatedAgents = applyPagination(agentData, page, limit);
  const indeterminate =
    selectedAgents.length > 0 && selectedAgents.length < agentData.length;
  const selectedAllAgents = selectedAgents.length === agentData.length;

  const callback = async () => {
    await getAgents();
    setSelectedAgents([]);
    setTabsData([]);
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      // TODO we might want to switch from email in selected array to sub

      await agentService.bulkDelete(selectedAgents);
      await callback();
    } catch (error) {
      Swal.fire({
        icon: "error",
        timer: 4000,
        text: getAxiosErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader
        title={t("users")}
        action={
          selectedAgents.length ? (
            <Box display="flex" gap={2}>
              {selectedAgents.length === 1 ? (
                <ModalButton
                  text={t("update")}
                  buttonProps={{
                    variant: "contained",
                  }}
                  title="Update agent"
                >
                  <UpdateAgentForm
                    selected={selectedAgents[0]}
                    onDone={callback}
                  />
                </ModalButton>
              ) : null}
              <Button
                variant="contained"
                onClick={() => changeStatus("enable")}
              >
                {t("enabled")}
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() => changeStatus("disable")}
              >
                {t("disabled")}
              </Button>
              {selectedAgents.length ? (
                <ConfirmModal
                  buttonText={t("delete")}
                  title={t("delete")}
                  handleConfirm={() => handleDelete()}
                  confirmMessage={t("deleteSomeAgents")}
                  confirmText={t("submit")}
                  buttonProps={{
                    variant: "contained",
                    color: "warning",
                  }}
                />
              ) : null}
            </Box>
          ) : null
        }
        sx={{ height: "60px" }}
      />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllAgents}
                  indeterminate={indeterminate}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {headCells.map((headCell: any) => (
                <TableCell key={headCell.id}>{t(headCell.label)}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={headCells.length + 1}
                  align="center"
                  height="200px"
                >
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : (
              paginatedAgents.map((item) => {
                const agentSelected = selectedAgents.includes(item.email);
                return (
                  <TableRow
                    hover
                    key={item.sub}
                    selected={agentSelected}
                    onClick={(e) => handleSelectOne(e, item.email)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={agentSelected}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          handleSelectOne(event, item.email)
                        }
                        value={agentSelected}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {`${item.name} ${item.family_name}`}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {item.phone_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {item.email}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusLabel(item.status)}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={agentData.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
          labelRowsPerPage={t("rowsPerPage")}
        />
      </Box>
    </Card>
  );
};

export default AgentTable;
