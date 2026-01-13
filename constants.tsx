import { CypressAction } from './types';
import { MousePointer2, Keyboard, CheckCircle, FileInput } from 'lucide-react';
import React from 'react';

export const EXAMPLE_HTML = `<!-- Example HTML -->
<div class="login-form">
  <input 
    type="email" 
    data-cy="email-input" 
    placeholder="Enter email"
    class="form-control"
  />
  <button id="btn-submit" class="btn btn-primary mt-4">
    Login
  </button>
</div>`;

export const CYPRESS_ACTIONS: CypressAction[] = [
  // Actions
  { id: 'click', label: 'Click', code: '.click()', category: 'action', description: 'Click the element' },
  { id: 'dblclick', label: 'Double Click', code: '.dblclick()', category: 'action', description: 'Double click the element' },
  { id: 'rightclick', label: 'Right Click', code: '.rightclick()', category: 'action', description: 'Right click the element' },
  { id: 'hover', label: 'Hover', code: ".trigger('mouseover')", category: 'action', description: 'Trigger mouseover event' },
  
  // Inputs
  { id: 'type', label: 'Type Text', code: ".type('Hello World')", category: 'input', description: 'Type text into input' },
  { id: 'clear', label: 'Clear', code: '.clear()', category: 'input', description: 'Clear input field' },
  { id: 'blur', label: 'Blur', code: '.blur()', category: 'input', description: 'Blur the element' },

  // Form
  { id: 'check', label: 'Check', code: '.check()', category: 'form', description: 'Check checkbox/radio' },
  { id: 'uncheck', label: 'Uncheck', code: '.uncheck()', category: 'form', description: 'Uncheck checkbox' },
  { id: 'select', label: 'Select Option', code: ".select('option_value')", category: 'form', description: 'Select an option from dropdown' },
  { id: 'submit', label: 'Submit', code: '.submit()', category: 'form', description: 'Submit a form' },

  // Assertions
  { id: 'exist', label: 'Should Exist', code: ".should('exist')", category: 'assertion', description: 'Assert element exists in DOM' },
  { id: 'visible', label: 'Be Visible', code: ".should('be.visible')", category: 'assertion', description: 'Assert element is visible' },
  { id: 'contain', label: 'Contain Text', code: ".should('contain.text', 'value')", category: 'assertion', description: 'Assert element contains text' },
  { id: 'haveClass', label: 'Have Class', code: ".should('have.class', 'active')", category: 'assertion', description: 'Assert element has class' },
  { id: 'beDisabled', label: 'Be Disabled', code: ".should('be.disabled')", category: 'assertion', description: 'Assert element is disabled' },
];

export const CATEGORY_ICONS = {
  action: <MousePointer2 className="w-4 h-4" />,
  input: <Keyboard className="w-4 h-4" />,
  form: <FileInput className="w-4 h-4" />,
  assertion: <CheckCircle className="w-4 h-4" />
};