import { connect } from 'react-redux'
import { State } from '../../../reducers'
import CostOverviewControl from '../CostOverviewControl'
import { updateAnalysisDates } from '../../../actions/actions'
import { getAnalysisFromDate, getAnalysisToDate } from '../../../selectors/costItems'

const mapStateToProps = (state: State) => ({
    from: getAnalysisFromDate(state),
    to: getAnalysisToDate(state)
})
const mapDispatchToProps = {
    updateAnalysisDates: updateAnalysisDates
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(CostOverviewControl)