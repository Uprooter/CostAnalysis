import { connect } from 'react-redux'
import { State } from '../reducers'
import CostOverview from '../components/CostOverview'
import { updatePageName, addCostItems, updateAverageCostResult } from '../actions/actions'
import { getAverageCost } from '../selectors/costItems'

const mapStateToProps = (state: State) => ({
  averageCosts: getAverageCost(state)
})
const mapDispatchToProps = {
  updatePageName: updatePageName,
  addCostItems: addCostItems,
  updateAverageCostResult: updateAverageCostResult,
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(CostOverview)