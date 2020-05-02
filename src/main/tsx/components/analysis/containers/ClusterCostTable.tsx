import { connect } from 'react-redux'
import { State } from '../../../reducers'
import ClusterCostTable from '../ClusterCostTable'
import { getAnalysisFromDate, getAnalysisToDate } from '../../../selectors/selectors'

const mapStateToProps = (state: State) => ({
    from: getAnalysisFromDate(state),
    to: getAnalysisToDate(state)
})

export default connect<any, any, any>(mapStateToProps, {})(ClusterCostTable)