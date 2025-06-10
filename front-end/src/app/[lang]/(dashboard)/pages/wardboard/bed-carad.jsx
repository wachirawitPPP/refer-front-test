// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'


// Third-Party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'
import { Divider } from '@mui/material'

export const chipColor = {
    UX: { color: 'success' },
    'Code Review': { color: 'error' },
    Dashboard: { color: 'info' },
    Images: { color: 'warning' },
    App: { color: 'secondary' },
    'Charts & Map': { color: 'primary' },
}

const BedCard = (props) => {
    const vacant_bed = '/images/misc/vacant_bed.svg'
    const reseverd_bed = '/images/misc/reseverd_bed.svg'
    // Props
    const {
        task,
        column,
        setColumns,
        columns,
        setDrawerOpen,
        tasksList,
        setTasksList,
        pt_name,
        hn,
        an,
        age,
        ward,
        dept,
        bed,
        room,
        cp,
        status_bed
    } = props

    // States
    const [anchorEl, setAnchorEl] = useState(null)
    const [menuOpen, setMenuOpen] = useState(false)

    // Handle menu click
    const handleClick = (e) => {
        setMenuOpen(true)
        setAnchorEl(e.currentTarget)
    }

    // Handle menu close
    const handleClose = () => {
        setAnchorEl(null)
        setMenuOpen(false)
    }

    // Handle Task Click
    const handleTaskClick = () => {
        setDrawerOpen(true)
    }

    // Delete Task
    const handleDeleteTask = () => {
        setTasksList(tasksList.filter((taskItem) => taskItem?.id !== task.id))
        const newTaskIds = column.taskIds.filter((taskId) => taskId !== task.id)
        const newColumn = { ...column, taskIds: newTaskIds }
        const newColumns = columns.map((col) => (col.id === column.id ? newColumn : col))
        setColumns(newColumns)
    }

    // Handle Delete
    const handleDelete = () => {
        handleClose()
        handleDeleteTask()
    }
    const statusBed = {
        1: 'success',
        2: 'info',
    }

    const color_header = {
        1: 'w-full my-2 mx-2  border-y-4  border-green-500',
        2: 'w-full my-2 mx-2  border-y-4  border-cyan-500'
    }

    return (
        <Card
            className={color_header[status_bed]}
            style={{ marginTop: '0.24rem', marginRight: '0.5rem', height: '100%' }} // Ensures consistent height
        >
            <CardContent className="flex flex-col gap-y-2 items-start relative overflow-hidden">
                {/* Card Header */}
                <div className="flex justify-between items-center w-full pb-2 border-b border-gray-300">
                    <Chip variant="tonal" label={status_bed === '1' ? "Vacant Bed" : status_bed === '2' ? 'Discharge' : ''} size="small" color={statusBed[status_bed]} />
                </div>

                {/* Menu Button */}
                <div className="absolute block-start-4 inline-end-3">
                    <IconButton
                        aria-label="more"
                        size="small"
                        className={classnames(styles.menu, {
                            [styles.menuOpen]: menuOpen,
                        })}
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <i className="tabler-dots-vertical" />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Duplicate Task</MenuItem>
                        <MenuItem onClick={handleClose}>Copy Task Link</MenuItem>
                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                    </Menu>
                </div>

                {/* Card Content */}
                <div className="flex gap-4 w-full">
                    {/* Text Content */}

                    {status_bed === '1' ? (
                        <>

                            {/* Image */}
                            <div className="flex items-center justify-center max-w-[90%]">
                                <img
                                    src={vacant_bed}
                                    alt="Reserved Bed"
                                    className="object-contain"
                                    style={{ width: '200px', height: '150px' }}
                                />
                            </div>
                        </>) : (
                        <>
                            <div className="flex flex-col flex-grow max-w-[70%]">
                                <div className="flex items-center gap-1">
                                    <i className="tabler-user text-xs" />
                                    <span className="text-xs">{pt_name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <i className="tabler-hospital text-xs" />
                                    <span className="text-xs">HN: {hn}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <i className="tabler-square-letter-a text-xs" />
                                    <span className="text-xs">AN: {an}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <i className="tabler-calendar-time text-xs" />
                                    <span className="text-xs">อายุ: {age} ปี</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <i className="tabler-bed-flat text-xs" />
                                    <span className="text-xs">Ward: {ward}</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <i className="tabler-stethoscope text-xs" />
                                    <span className="text-xs">CP: {cp}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <i className="tabler-first-aid-kit text-xs" />
                                    <span className="text-xs">Dept: {dept}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-center max-w-[30%]">
                                <img
                                    src={status_bed === '1' ? vacant_bed : status_bed === '2' ? reseverd_bed : ''}
                                    alt="Reserved Bed"
                                    className="object-contain"
                                    style={{ width: '100px', height: '100px' }}
                                />
                            </div>
                        </>)}


                </div>

                {/* Footer Content */}
                {status_bed === '2' ? (<>
                    <div className="flex gap-4 w-full mt-2">
                    <div className="flex items-center gap-1">
                        <i className="tabler-bed text-xs text-textSecondary" />
                        <span className="text-xs">Bed: {bed}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <i className="tabler-door text-xs text-textSecondary" />
                        <span className="text-xs">Room: {room}</span>
                    </div>
                </div>
                </>) : ''}
                
            </CardContent>
        </Card>

    )
}

export default BedCard
