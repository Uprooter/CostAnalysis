import { connect } from 'react-redux'
import { State } from '../../../reducers'
import CostOverview from '../CostOverview'
import { updatePageName, updateAverageCostResult, updateClusterCosts } from '../../../actions/actions'
import { getAverageCost, getClusterCosts } from '../../../selectors/selectors'

const mapStateToProps = (state: State) => ({
  averageCosts: getAverageCost(state),
  clusterCosts: getClusterCosts(state)
})
const mapDispatchToProps = {
  updatePageName: updatePageName,
  updateAverageCostResult: updateAverageCostResult,
  updateClusterCosts: updateClusterCosts,
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(CostOverview)