<script setup lang="ts">
import { ref } from 'vue'
import { useWorkTaskStore } from '../store/useWorkTaskStore'
import { marked } from 'marked';

const store = useWorkTaskStore()

const defaultMarkdown = `
# Process Steps

#### CO or PF Assignment
- [ ] Developer schedules a technical design meeting with the CO/PF TFAL.  
- [ ] Move PPM to "Start."

#### Technical Design Meeting
- [ ] Conduct the technical design meeting.  
    - Discuss background and high-level solutions.  
    - Address any arising questions.  
- [ ] Move PPM to "Technical Design Complete."

#### Developer Research
- [ ] Research the planned change.  
- [ ] Document all changes/pseudocode in the **COXXXXX - Program Specifications** document.  
    - If UI changes are required, use **COXXXXX - UI PROGRAM SPECIFICATIONS**.  
    - Include high-level or low-level pseudocode based on requirements.  
- [ ] List projected file changes/additions in the **COXXXXX – IMPLEMENTATION PLAN** document.  
- [ ] Run a Coverity scan and populate the initial portion of the **COXXXXX - ASQC SCAN** document with results.  
- [ ] Schedule a "Technical Design – Walkthrough" meeting with CO/PF TFAL and developers.

#### Technical Design – Walkthrough Meeting
- [ ] Conduct the walkthrough meeting (technical audience).  
    - Review and refine pseudocode and planned changes.

#### Developer Unit Test Research
- [ ] Populate the **COXXXXX - UNIT TEST PLAN AND RESULTS** document with projected test cases.  
- [ ] Schedule a unit test case review meeting with:
    - Assigned BA, Test Lead, TFAL, and another developer working on the same SCR.  

#### Unit Test Case Review Meeting
- [ ] Conduct the review meeting (business audience).  
    - Obtain feedback from the BA, Test Lead, and TFAL.  
    - If schedules conflict, meet with BA/Test Lead separately and ensure TFAL approval.  

- [ ] If applicable, construct a unit test suite to:  
    - [ ] Create data for tests.  
    - [ ] Run test cases.  
    - [ ] Delete test data after execution.  

---

### Implementation
- [ ] Move PPM to "Construction Started."  
- [ ] Create a new branch in ADO for the CO/PF:  
    - [ ] Name it \`CO/PF<ALM number>\`.  
- [ ] Implement the solution.  
- [ ] Test the implementation using the proposed Unit Test Plan.  
    - [ ] Populate results in the **COXXXXX - UNIT TEST PLAN AND RESULTS** document.  
- [ ] Run a second Coverity scan on edited files and populate the final portion of **COXXXXX - ASQC SCAN**.  
- [ ] Submit a code review to:  
    - [ ] TFALs of the team.  
    - [ ] 3–4 developers, especially those working on the same SCR.  
    - [ ] TFALs/developers of related teams.  
- [ ] Populate the ALM comment in the Construction document with the code review "work item" number.  
- [ ] Add all documents to ALM.  
    - [ ] Wait to add **COXXXXX – CONSTRUCTION WSSR** and **COXXXXX – IMPLEMENTATION PLAN** until they include the Changeset number.  
- [ ] Schedule a Walkthrough meeting with:
    - TFAL.  
    - BA.  
    - Test Lead.  
    - 3 developers.  
    - Associated TFALs/developers/BAs.  
    - (Optional) Other TFALs of the team.  
- [ ] Complete the **COXXXXX – CONSTRUCTION WSSR** document.  

#### Walkthrough
- [ ] Conduct the walkthrough meeting (business/partial technical audience).  
    - Review various documents.  
    - If no changes occurred after Technical Design, optional to review:
        - **COXXXXX – DESIGN WSSR** (not required for PF).  
        - **COXXXXX – IMPLEMENTATION PLAN.**  
        - **COXXXXX - UI PROGRAM SPECIFICATIONS / Program Specifications.**  
    - Required to review:
        - **COXXXXX - ASQC SCAN.**  
        - **COXXXXX – CONSTRUCTION WSSR.**  
        - **COXXXXX - UNIT TEST PLAN AND RESULTS.**  
- [ ] Move PPM to "Construction Walkthrough Complete."  

---

### Finalization

#### Check-In
- [ ] Ensure code review is complete and approved by TFAL.  
- [ ] Pull the latest code from TFS and resolve conflicts.  
- [ ] Check in the code and populate the Changeset number in:
    - **COXXXXX – CONSTRUCTION WSSR.**  
    - **COXXXXX – IMPLEMENTATION PLAN.**  
- [ ] Upload remaining documents to ALM.  
- [ ] Update PPM.

#### Commit (ADO)
- [ ] Commit changes to the new branch.  
- [ ] Create a new pull request in ADO to merge into Development.  
- [ ] Assign reviewers:  
    - [ ] TFAL (must approve).  
    - [ ] 3 developers related to the CO/PF.

--- 
`;

const taskTitle = ref('')
const taskDescription = ref('')
const taskPriority = ref('Low')
const taskStatus = ref('Not Started')
const taskDueDate = ref('')
const taskMarkdown = ref(defaultMarkdown)
const taskCompletedDate = ref('')

const ensureAllFieldsFilled = () => {
    const fields = [
        taskTitle.value,
        taskDescription.value,
        taskPriority.value,
        taskStatus.value,
        taskDueDate.value,
        taskMarkdown.value,
    ]
    return fields.every(field => field.trim() !== '')
}

const handleTaskPost = async () => {
    if (!ensureAllFieldsFilled()) {
        return
    }

    const taskData = {
        title: taskTitle.value,
        description: taskDescription.value,
        priority: taskPriority.value,
        status: taskStatus.value,
        dueDate: taskDueDate.value,
        markdown: taskMarkdown.value,
        isCompleted: taskStatus.value === 'Completed',
    }

    if (taskCompletedDate.value !== null && taskCompletedDate.value !== '') {
        taskData.completedAt = taskCompletedDate.value;
    }

    const html = marked.parse(taskMarkdown.value);
    taskData.html = html;

    await store.addWorkTask(taskData)

    resetForm()
}

const resetForm = () => {
    taskTitle.value = ''
    taskDescription.value = ''
    taskPriority.value = ''
    taskStatus.value = ''
    taskDueDate.value = ''
    taskMarkdown.value = defaultMarkdown
    taskCompletedDate.value = ''
}
</script>

<template>
    <div class="modal fade" id="new-task-modal" tabindex="-1" aria-labelledby="new-task-modalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="card-title" id="task-modal-title">New Task</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body w-100">
                    <div class="card mt-3">
                        <div class="card-body">
                            <form id="readmeForm">
                                <div class="mb-3">
                                    <label for="titleInput" class="form-label">Title</label>
                                    <input type="text" class="form-control" id="task-title" required
                                        placeholder="Enter task title" v-model="taskTitle">
                                </div>
                                <div class="mb-3">
                                    <label for="titleInput" class="form-label">Description</label>
                                    <textarea class="form-control" id="task-description" rows="5" required
                                        placeholder="Enter task description" v-model="taskDescription"></textarea>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6">
                                        <div class="mb-3">
                                            <label for="titleInput" class="form-label">Priority</label>
                                            <select class="form-select" aria-label="Default select example"
                                                id="task-priority" required v-model="taskPriority">
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="mb-3">
                                            <label for="titleInput" class="form-label">Status</label>
                                            <select class="form-select" aria-label="Default select example"
                                                id="task-status" required v-model="taskStatus">
                                                <option value="Not Started">Not Started</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6">
                                        <div class="mb-3">
                                            <label for="titleInput" class="form-label">Due Date</label>
                                            <input type="date" class="form-control" id="task-due-date" required
                                                v-model="taskDueDate">
                                        </div>
                                    </div>
                                    <div class="col-lg-6" id="task-completed-date"
                                        :class="{ 'd-none': taskStatus !== 'Completed' }">
                                        <div class="mb-3">
                                            <label for="titleInput" class="form-label">Completed Date</label>
                                            <input type="date" class="form-control" id="task-completed-date"
                                                v-model="taskCompletedDate">
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" id="save-button" data-bs-dismiss="modal"
                        @click="handleTaskPost">Submit</button>
                </div>
            </div>
        </div>
    </div>
</template>