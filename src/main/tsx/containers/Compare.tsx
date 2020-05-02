import { connect } from 'react-redux'
import Compare from '../components/compare/CompareView'
import { updateCompareDates } from '../actions/actions'
import { getCompareMonthA, getCompareMonthB } from '../selectors/selectors'
import { State } from '../reducers'

const mapStateToProps = (state: State) => ({
  monthA: getCompareMonthA(state),
  monthB: getCompareMonthB(state)
})
const mapDispatchToProps = {
  updateCompareDates: updateCompareDates
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(Compare)