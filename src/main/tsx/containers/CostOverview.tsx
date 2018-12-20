import { connect } from 'react-redux'
import { State } from '../reducers'
import CostOverview from '../components/CostOverview'
import { updatePageName,addCostItems } from '../actions/actions'
import { getCostItems } from '../selectors/costItems'

const mapStateToProps = (state: State) => ({
  costItems: getCostItems(state)
})
const mapDispatchToProps = {
  updatePageName: updatePageName,
   addCostItems: addCostItems
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(CostOverview)