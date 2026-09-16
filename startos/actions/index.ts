import { sdk } from '../sdk'
import { configureDashboard } from './configureDashboard'
import { manageFamilyMembers } from './manageFamilyMembers'

export const actions = sdk.Actions.of()
  .addAction(manageFamilyMembers)
  .addAction(configureDashboard)
