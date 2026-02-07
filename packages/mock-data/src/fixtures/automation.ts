export interface AutomationRule {
  id: string;
  venueId: string;
  name: string;
  description: string;
  trigger: 'time' | 'booking' | 'occupancy' | 'temperature';
  triggerValue: string;
  action: string;
  actionDevice: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

let automationRulesDatabase: AutomationRule[] = [
  {
    id: 'rule-1',
    venueId: 'venue-1',
    name: 'Night Mode',
    description: 'All floodlights OFF at 00:00 AM',
    trigger: 'time',
    triggerValue: '00:00',
    action: 'turn_off',
    actionDevice: 'all_floodlights',
    isEnabled: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-07T10:00:00Z',
  },
  {
    id: 'rule-2',
    venueId: 'venue-1',
    name: 'Open House',
    description: 'Main Gate UNLOCKS at 07:00 AM',
    trigger: 'time',
    triggerValue: '07:00',
    action: 'unlock',
    actionDevice: 'main_gate',
    isEnabled: true,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-02-07T10:00:00Z',
  },
];

export function getAutomationRulesByVenue(venueId: string): AutomationRule[] {
  return automationRulesDatabase.filter((r) => r.venueId === venueId);
}

export function getAutomationRuleById(ruleId: string): AutomationRule | undefined {
  return automationRulesDatabase.find((r) => r.id === ruleId);
}

export function createAutomationRule(venueId: string, data: Partial<AutomationRule>): AutomationRule {
  const newRule: AutomationRule = {
    id: `rule-${Date.now()}`,
    venueId,
    name: data.name || 'New Rule',
    description: data.description || '',
    trigger: data.trigger || 'time',
    triggerValue: data.triggerValue || '12:00',
    action: data.action || 'turn_on',
    actionDevice: data.actionDevice || '',
    isEnabled: data.isEnabled !== undefined ? data.isEnabled : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  automationRulesDatabase.push(newRule);
  return newRule;
}

export function updateAutomationRule(ruleId: string, data: Partial<AutomationRule>): AutomationRule | undefined {
  const index = automationRulesDatabase.findIndex((r) => r.id === ruleId);
  if (index === -1) return undefined;

  const updatedRule = {
    ...automationRulesDatabase[index],
    ...data,
    id: automationRulesDatabase[index].id,
    venueId: automationRulesDatabase[index].venueId,
    createdAt: automationRulesDatabase[index].createdAt,
    updatedAt: new Date().toISOString(),
  };

  automationRulesDatabase[index] = updatedRule;
  return updatedRule;
}

export function deleteAutomationRule(ruleId: string): boolean {
  const index = automationRulesDatabase.findIndex((r) => r.id === ruleId);
  if (index === -1) return false;

  automationRulesDatabase.splice(index, 1);
  return true;
}
