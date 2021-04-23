import { AgentsDto } from '../dto/agents.dto';

export const getAgentRoleTranslationKey = (agents: AgentsDto, uuid: string) => {
  let suffix = '';
  if (agents.CARRIER !== undefined && uuid === agents.CARRIER.UUID) suffix = 'carrier';
  else if (agents.CONSIGNEE !== undefined && uuid === agents.CONSIGNEE.UUID) suffix = 'consignee';
  else if (agents.DRIVER !== undefined && uuid === agents.DRIVER.UUID) suffix = 'driver';
  else if (agents.FORWARDER !== undefined && uuid === agents.FORWARDER.UUID) suffix = 'forwarder';
  else if (agents.SENDER !== undefined && uuid === agents.SENDER.UUID) suffix = 'sender';
  else suffix = 'Unknown';
  return `CMRMetadata.roles.${suffix}`;
};
