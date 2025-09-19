#!/usr/bin/env python3
"""
Workflow Diagrams API Server
Runs on port 5001 to serve diagram generation requests from the main website
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import subprocess
import tempfile
import base64
import json
import logging
import uuid
from typing import Dict, List, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIDiagramGenerator:
    """AI-powered diagram generation from natural language descriptions"""
    
    def __init__(self, workflow_diagrams_path: str):
        self.workflow_diagrams_path = workflow_diagrams_path
        self.custom_diagrams_dir = os.path.join(workflow_diagrams_path, "custom")
        os.makedirs(self.custom_diagrams_dir, exist_ok=True)
        logger.info(f"AIDiagramGenerator initialized with path: {workflow_diagrams_path}")
    
    def generate_plantuml_from_description(self, description: str, diagram_type: str = "auto") -> Dict:
        """Generate PlantUML code from natural language description"""
        try:
            logger.info(f"Generating PlantUML from description: {description[:100]}...")
            
            # Determine diagram type if auto
            if diagram_type == "auto":
                diagram_type = self._determine_diagram_type(description)
            
            # Generate PlantUML code based on description
            plantuml_code = self._create_plantuml_code(description, diagram_type)
            
            # Save to custom file
            diagram_id = str(uuid.uuid4())[:8]
            filename = f"ai_generated_{diagram_id}.puml"
            filepath = os.path.join(self.custom_diagrams_dir, filename)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(plantuml_code)
            
            logger.info(f"Generated PlantUML code saved to: {filepath}")
            
            return {
                'status': 'success',
                'plantuml_code': plantuml_code,
                'diagram_type': diagram_type,
                'filename': filename,
                'filepath': filepath,
                'diagram_id': diagram_id
            }
            
        except Exception as e:
            logger.error(f"Error generating PlantUML from description: {str(e)}")
            return {
                'status': 'error',
                'message': f'Failed to generate PlantUML: {str(e)}'
            }
    
    def _determine_diagram_type(self, description: str) -> str:
        """Determine the best diagram type based on description"""
        description_lower = description.lower()
        
        # Sequence diagram keywords
        if any(keyword in description_lower for keyword in ['sequence', 'flow', 'process', 'step', 'order', 'timeline', 'interaction']):
            return 'sequence'
        
        # Class diagram keywords  
        if any(keyword in description_lower for keyword in ['class', 'object', 'relationship', 'inheritance', 'composition', 'association']):
            return 'class'
        
        # Component diagram keywords
        if any(keyword in description_lower for keyword in ['component', 'module', 'service', 'system', 'architecture', 'structure']):
            return 'component'
        
        # Deployment diagram keywords
        if any(keyword in description_lower for keyword in ['deployment', 'server', 'infrastructure', 'environment', 'host']):
            return 'deployment'
        
        # Activity diagram keywords
        if any(keyword in description_lower for keyword in ['activity', 'workflow', 'decision', 'branch', 'merge']):
            return 'activity'
        
        # Default to sequence for general descriptions
        return 'sequence'
    
    def _create_plantuml_code(self, description: str, diagram_type: str) -> str:
        """Create PlantUML code based on description and diagram type"""
        
        if diagram_type == 'sequence':
            return self._generate_sequence_diagram(description)
        elif diagram_type == 'class':
            return self._generate_class_diagram(description)
        elif diagram_type == 'component':
            return self._generate_component_diagram(description)
        elif diagram_type == 'deployment':
            return self._generate_deployment_diagram(description)
        elif diagram_type == 'activity':
            return self._generate_activity_diagram(description)
        else:
            return self._generate_sequence_diagram(description)
    
    def _generate_sequence_diagram(self, description: str) -> str:
        """Generate sequence diagram PlantUML code"""
        # Extract entities and actions from description
        entities = self._extract_entities(description)
        actions = self._extract_actions(description)
        
        plantuml_code = "@startuml\n"
        plantuml_code += "!theme plain\n"
        plantuml_code += "title " + description[:50] + "\n\n"
        
        # Add participants
        for entity in entities[:4]:  # Limit to 4 entities
            plantuml_code += f"participant \"{entity}\" as {entity.replace(' ', '_').lower()}\n"
        
        plantuml_code += "\n"
        
        # Add interactions
        if len(entities) >= 2:
            plantuml_code += f"{entities[0].replace(' ', '_').lower()} -> {entities[1].replace(' ', '_').lower()}: {actions[0] if actions else 'Request'}\n"
            plantuml_code += f"{entities[1].replace(' ', '_').lower()} --> {entities[0].replace(' ', '_').lower()}: Response\n"
        
        plantuml_code += "@enduml"
        return plantuml_code
    
    def _generate_class_diagram(self, description: str) -> str:
        """Generate class diagram PlantUML code"""
        entities = self._extract_entities(description)
        
        plantuml_code = "@startuml\n"
        plantuml_code += "!theme plain\n"
        plantuml_code += "title " + description[:50] + "\n\n"
        
        for i, entity in enumerate(entities[:3]):  # Limit to 3 classes
            class_name = entity.replace(' ', '')
            plantuml_code += f"class {class_name} {{\n"
            plantuml_code += f"  + {entity.lower()}()\n"
            plantuml_code += f"  - data: string\n"
            plantuml_code += "}\n\n"
        
        # Add relationships
        if len(entities) >= 2:
            plantuml_code += f"{entities[0].replace(' ', '')} --> {entities[1].replace(' ', '')}\n"
        
        plantuml_code += "@enduml"
        return plantuml_code
    
    def _generate_component_diagram(self, description: str) -> str:
        """Generate component diagram PlantUML code"""
        entities = self._extract_entities(description)
        
        plantuml_code = "@startuml\n"
        plantuml_code += "!theme plain\n"
        plantuml_code += "title " + description[:50] + "\n\n"
        
        for entity in entities[:4]:  # Limit to 4 components
            component_name = entity.replace(' ', '')
            plantuml_code += f"component \"{entity}\" as {component_name}\n"
        
        plantuml_code += "\n"
        
        # Add connections
        if len(entities) >= 2:
            for i in range(len(entities)-1):
                plantuml_code += f"{entities[i].replace(' ', '')} --> {entities[i+1].replace(' ', '')}\n"
        
        plantuml_code += "@enduml"
        return plantuml_code
    
    def _generate_deployment_diagram(self, description: str) -> str:
        """Generate deployment diagram PlantUML code"""
        entities = self._extract_entities(description)
        
        plantuml_code = "@startuml\n"
        plantuml_code += "!theme plain\n"
        plantuml_code += "title " + description[:50] + "\n\n"
        
        plantuml_code += "node \"Server\" {\n"
        for entity in entities[:3]:  # Limit to 3 components
            plantuml_code += f"  component \"{entity}\"\n"
        plantuml_code += "}\n\n"
        
        plantuml_code += "node \"Client\" {\n"
        plantuml_code += "  component \"Web Browser\"\n"
        plantuml_code += "}\n\n"
        
        plantuml_code += "Client --> Server\n"
        plantuml_code += "@enduml"
        return plantuml_code
    
    def _generate_activity_diagram(self, description: str) -> str:
        """Generate activity diagram PlantUML code"""
        actions = self._extract_actions(description)
        
        plantuml_code = "@startuml\n"
        plantuml_code += "!theme plain\n"
        plantuml_code += "title " + description[:50] + "\n\n"
        
        plantuml_code += "start\n"
        
        for i, action in enumerate(actions[:5]):  # Limit to 5 actions
            plantuml_code += f":{action};\n"
            if i < len(actions)-1:
                plantuml_code += "->\n"
        
        plantuml_code += "stop\n"
        plantuml_code += "@enduml"
        return plantuml_code
    
    def _extract_entities(self, description: str) -> List[str]:
        """Extract potential entities from description"""
        # Simple entity extraction - in a real system, this would use NLP
        words = description.split()
        entities = []
        
        # Look for capitalized words and common entity patterns
        for word in words:
            if word[0].isupper() and len(word) > 2:
                entities.append(word)
        
        # If no entities found, create some default ones
        if not entities:
            entities = ['User', 'System', 'Database']
        
        return entities[:5]  # Limit to 5 entities
    
    def _extract_actions(self, description: str) -> List[str]:
        """Extract potential actions from description"""
        # Simple action extraction - in a real system, this would use NLP
        action_words = ['process', 'handle', 'manage', 'create', 'update', 'delete', 'send', 'receive', 'validate', 'authenticate']
        
        actions = []
        description_lower = description.lower()
        
        for action in action_words:
            if action in description_lower:
                actions.append(action.capitalize())
        
        # If no actions found, create some default ones
        if not actions:
            actions = ['Process Request', 'Handle Response']
        
        return actions[:5]  # Limit to 5 actions

class DiagramGenerator:
    def __init__(self, workflow_diagrams_path: str):
        self.workflow_diagrams_path = workflow_diagrams_path
        self.supported_formats = ['png', 'svg', 'pdf']
        logger.info(f"DiagramGenerator initialized with path: {workflow_diagrams_path}")
        
    def generate_plantuml_diagram(self, 
                                 diagram_type: str, 
                                 output_format: str = 'png',
                                 custom_content: Optional[str] = None) -> Dict:
        """Generate PlantUML diagram"""
        try:
            logger.info(f"Generating {diagram_type} diagram in {output_format} format")
            
            source_file = f"{self.workflow_diagrams_path}/plantuml_{diagram_type}.puml"
            logger.info(f"Looking for source file: {source_file}")
            
            if not os.path.exists(source_file):
                error_msg = f'Source file {source_file} not found'
                logger.error(error_msg)
                return {
                    'status': 'error',
                    'message': error_msg
                }
            
            with tempfile.TemporaryDirectory() as temp_dir:
                logger.info(f"Using temporary directory: {temp_dir}")
                
                cmd = [
                    'plantuml',
                    f'-t{output_format}',
                    source_file,
                    f'-o{temp_dir}'
                ]
                
                logger.info(f"Running command: {' '.join(cmd)}")
                result = subprocess.run(cmd, capture_output=True, text=True)
                
                if result.returncode != 0:
                    error_msg = f'PlantUML generation failed: {result.stderr}'
                    logger.error(error_msg)
                    return {
                        'status': 'error',
                        'message': error_msg
                    }
                
                output_file = None
                for file in os.listdir(temp_dir):
                    if file.endswith(f'.{output_format}'):
                        output_file = os.path.join(temp_dir, file)
                        break
                
                if not output_file:
                    error_msg = 'Generated file not found'
                    logger.error(error_msg)
                    return {
                        'status': 'error',
                        'message': error_msg
                    }
                
                with open(output_file, 'rb') as f:
                    file_data = base64.b64encode(f.read()).decode('utf-8')
                
                logger.info(f"Successfully generated {diagram_type} diagram, size: {len(file_data)} bytes")
                
                return {
                    'status': 'success',
                    'file_data': file_data,
                    'format': output_format,
                    'diagram_type': diagram_type,
                    'file_size': len(file_data)
                }
                
        except Exception as e:
            error_msg = f'Generation error: {str(e)}'
            logger.error(error_msg)
            return {
                'status': 'error',
                'message': error_msg
            }
    
    def get_available_diagrams(self) -> List[Dict]:
        """Get list of available diagrams"""
        diagrams = []
        
        diagram_types = [
            'architecture',
            'sequence', 
            'deployment',
            'class_diagram',
            'component_diagram'
        ]
        
        for diagram_type in diagram_types:
            source_file = f"{self.workflow_diagrams_path}/plantuml_{diagram_type}.puml"
            if os.path.exists(source_file):
                diagrams.append({
                    'type': diagram_type,
                    'name': diagram_type.replace('_', ' ').title(),
                    'source_file': source_file,
                    'formats': self.supported_formats
                })
        
        logger.info(f"Found {len(diagrams)} available diagrams")
        return diagrams
    
    def get_diagram_source(self, diagram_type: str) -> str:
        """Get PlantUML source code for a diagram"""
        source_file = f"{self.workflow_diagrams_path}/plantuml_{diagram_type}.puml"
        
        if os.path.exists(source_file):
            with open(source_file, 'r', encoding='utf-8') as f:
                content = f.read()
            logger.info(f"Retrieved source code for {diagram_type}, length: {len(content)}")
            return content
        else:
            logger.warning(f"Source file not found: {source_file}")
            return ""
    
    def generate_ai_diagram(self, filepath: str, output_format: str = 'png') -> Dict:
        """Generate diagram from AI-generated PlantUML file"""
        try:
            logger.info(f"Generating AI diagram from: {filepath}")
            
            if not os.path.exists(filepath):
                error_msg = f'AI-generated file {filepath} not found'
                logger.error(error_msg)
                return {
                    'status': 'error',
                    'message': error_msg
                }
            
            with tempfile.TemporaryDirectory() as temp_dir:
                logger.info(f"Using temporary directory: {temp_dir}")
                
                cmd = [
                    'plantuml',
                    f'-t{output_format}',
                    filepath,
                    f'-o{temp_dir}'
                ]
                
                logger.info(f"Running command: {' '.join(cmd)}")
                result = subprocess.run(cmd, capture_output=True, text=True)
                
                if result.returncode != 0:
                    error_msg = f'AI diagram generation failed: {result.stderr}'
                    logger.error(error_msg)
                    return {
                        'status': 'error',
                        'message': error_msg
                    }
                
                output_file = None
                for file in os.listdir(temp_dir):
                    if file.endswith(f'.{output_format}'):
                        output_file = os.path.join(temp_dir, file)
                        break
                
                if not output_file:
                    error_msg = f'No {output_format} file generated'
                    logger.error(error_msg)
                    return {
                        'status': 'error',
                        'message': error_msg
                    }
                
                with open(output_file, 'rb') as f:
                    image_data = f.read()
                
                encoded_image = base64.b64encode(image_data).decode('utf-8')
                
                logger.info(f"Successfully generated AI diagram, size: {len(image_data)} bytes")
                return {
                    'status': 'success',
                    'image_data': encoded_image,
                    'format': output_format,
                    'size': len(image_data)
                }
                
        except Exception as e:
            logger.error(f"Error generating AI diagram: {str(e)}")
            return {
                'status': 'error',
                'message': f'Failed to generate AI diagram: {str(e)}'
            }

    def update_diagram_source(self, diagram_type: str, source_code: str) -> Dict:
        """Update PlantUML source code for a diagram"""
        source_file = f"{self.workflow_diagrams_path}/plantuml_{diagram_type}.puml"
        
        try:
            # Create backup of original file
            backup_file = f"{source_file}.backup"
            if os.path.exists(source_file):
                import shutil
                shutil.copy2(source_file, backup_file)
                logger.info(f"Created backup: {backup_file}")
            
            # Write new source code
            with open(source_file, 'w', encoding='utf-8') as f:
                f.write(source_code)
            
            logger.info(f"Updated source code for {diagram_type}, length: {len(source_code)}")
            return {
                'status': 'success',
                'message': f'Source code updated for {diagram_type}',
                'file': source_file,
                'backup': backup_file if os.path.exists(source_file) else None
            }
        except Exception as e:
            logger.error(f"Error updating source code for {diagram_type}: {str(e)}")
            return {
                'status': 'error',
                'message': f'Failed to update source code: {str(e)}'
            }

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize diagram generator
WORKFLOW_DIAGRAMS_PATH = "/Users/ayush/AI_Projects/agenticchatbot/WorkflowDiagrams"
# Initialize the diagram generators
diagram_generator = DiagramGenerator(WORKFLOW_DIAGRAMS_PATH)
ai_diagram_generator = AIDiagramGenerator(WORKFLOW_DIAGRAMS_PATH)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        result = subprocess.run(['plantuml', '-version'], capture_output=True, text=True)
        plantuml_available = result.returncode == 0
        
        diagrams_dir_exists = os.path.exists(WORKFLOW_DIAGRAMS_PATH)
        
        return jsonify({
            'status': 'healthy',
            'plantuml_available': plantuml_available,
            'diagrams_dir_exists': diagrams_dir_exists,
            'diagrams_dir_path': WORKFLOW_DIAGRAMS_PATH,
            'available_diagrams': len(diagram_generator.get_available_diagrams())
        })
    except Exception as e:
        logger.error(f"Error in health check: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Health check failed: {str(e)}'
        }), 500

@app.route('/api/diagrams/list', methods=['GET'])
def list_diagrams():
    """Get list of available diagrams"""
    try:
        diagrams = diagram_generator.get_available_diagrams()
        return jsonify({
            'status': 'success',
            'diagrams': diagrams
        })
    except Exception as e:
        logger.error(f"Error listing diagrams: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to list diagrams: {str(e)}'
        }), 500

@app.route('/api/diagrams/generate', methods=['POST'])
def generate_diagram():
    """Generate a diagram"""
    try:
        data = request.json
        diagram_type = data.get('type')
        output_format = data.get('format', 'png')
        
        if not diagram_type:
            return jsonify({
                'status': 'error',
                'message': 'Diagram type is required'
            }), 400
        
        result = diagram_generator.generate_plantuml_diagram(
            diagram_type, 
            output_format
        )
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error generating diagram: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to generate diagram: {str(e)}'
        }), 500

@app.route('/api/diagrams/source/<diagram_type>', methods=['GET'])
def get_diagram_source(diagram_type: str):
    """Get PlantUML source code"""
    try:
        source = diagram_generator.get_diagram_source(diagram_type)
        return jsonify({
            'status': 'success',
            'source': source,
            'type': diagram_type
        })
    except Exception as e:
        logger.error(f"Error getting source code: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to get source code: {str(e)}'
        }), 500

@app.route('/api/diagrams/update', methods=['POST'])
def update_diagram_source():
    """Update PlantUML source code"""
    try:
        data = request.json
        diagram_type = data.get('type')
        source_code = data.get('source')
        
        if not diagram_type or not source_code:
            return jsonify({
                'status': 'error',
                'message': 'Missing diagram type or source code'
            }), 400
        
        # Update the source file
        result = diagram_generator.update_diagram_source(diagram_type, source_code)
        
        if result['status'] == 'success':
            return jsonify({
                'status': 'success',
                'message': f'Source code updated for {diagram_type}',
                'type': diagram_type
            })
        else:
            return jsonify({
                'status': 'error',
                'message': result['message']
            }), 500
            
    except Exception as e:
        logger.error(f"Error updating source code: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to update source code: {str(e)}'
        }), 500

@app.route('/api/ai/generate', methods=['POST'])
def generate_ai_diagram():
    """Generate diagram from natural language description"""
    try:
        data = request.json
        description = data.get('description')
        diagram_type = data.get('type', 'auto')
        output_format = data.get('format', 'png')
        
        if not description:
            return jsonify({
                'status': 'error',
                'message': 'Missing description parameter'
            }), 400
        
        # Generate PlantUML code from description
        ai_result = ai_diagram_generator.generate_plantuml_from_description(description, diagram_type)
        
        if ai_result['status'] != 'success':
            return jsonify({
                'status': 'error',
                'message': ai_result['message']
            }), 500
        
        # Generate the actual diagram image
        diagram_result = diagram_generator.generate_ai_diagram(ai_result['filepath'], output_format)
        
        if diagram_result['status'] != 'success':
            return jsonify({
                'status': 'error',
                'message': diagram_result['message']
            }), 500
        
        return jsonify({
            'status': 'success',
            'message': f'AI-generated {ai_result["diagram_type"]} diagram created successfully',
            'plantuml_code': ai_result['plantuml_code'],
            'diagram_type': ai_result['diagram_type'],
            'diagram_id': ai_result['diagram_id'],
            'image_data': diagram_result['image_data'],
            'format': output_format,
            'size': diagram_result['size']
        })
        
    except Exception as e:
        logger.error(f"Error generating AI diagram: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to generate AI diagram: {str(e)}'
        }), 500

@app.route('/api/ai/describe', methods=['POST'])
def describe_diagram_requirements():
    """Get PlantUML code from description without generating image"""
    try:
        data = request.json
        description = data.get('description')
        diagram_type = data.get('type', 'auto')
        
        if not description:
            return jsonify({
                'status': 'error',
                'message': 'Missing description parameter'
            }), 400
        
        # Generate PlantUML code from description
        ai_result = ai_diagram_generator.generate_plantuml_from_description(description, diagram_type)
        
        if ai_result['status'] != 'success':
            return jsonify({
                'status': 'error',
                'message': ai_result['message']
            }), 500
        
        return jsonify({
            'status': 'success',
            'message': f'PlantUML code generated for {ai_result["diagram_type"]} diagram',
            'plantuml_code': ai_result['plantuml_code'],
            'diagram_type': ai_result['diagram_type'],
            'diagram_id': ai_result['diagram_id'],
            'filename': ai_result['filename']
        })
        
    except Exception as e:
        logger.error(f"Error generating PlantUML code: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to generate PlantUML code: {str(e)}'
        }), 500

@app.route('/api/ai/list', methods=['GET'])
def list_ai_diagrams():
    """List all AI-generated diagrams"""
    try:
        custom_dir = os.path.join(WORKFLOW_DIAGRAMS_PATH, "custom")
        if not os.path.exists(custom_dir):
            return jsonify({
                'status': 'success',
                'diagrams': []
            })
        
        diagrams = []
        for filename in os.listdir(custom_dir):
            if filename.startswith('ai_generated_') and filename.endswith('.puml'):
                filepath = os.path.join(custom_dir, filename)
                diagram_id = filename.replace('ai_generated_', '').replace('.puml', '')
                
                # Read the first few lines to get title
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        title = "AI Generated Diagram"
                        if 'title' in content:
                            title_line = [line for line in content.split('\n') if 'title' in line.lower()]
                            if title_line:
                                title = title_line[0].split('title')[1].strip()
                except:
                    title = "AI Generated Diagram"
                
                diagrams.append({
                    'id': diagram_id,
                    'filename': filename,
                    'title': title,
                    'type': 'ai_generated',
                    'created': os.path.getctime(filepath)
                })
        
        # Sort by creation time (newest first)
        diagrams.sort(key=lambda x: x['created'], reverse=True)
        
        return jsonify({
            'status': 'success',
            'diagrams': diagrams,
            'count': len(diagrams)
        })
        
    except Exception as e:
        logger.error(f"Error listing AI diagrams: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to list AI diagrams: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("🚀 Starting Workflow Diagrams API Server...")
    print(f"📁 Workflow Diagrams Path: {WORKFLOW_DIAGRAMS_PATH}")
    print("🌐 API Server: http://localhost:6060")
    print("📊 Health Check: http://localhost:6060/api/health")
    print("📋 Available Endpoints:")
    print("   - GET  /api/health")
    print("   - GET  /api/diagrams/list")
    print("   - POST /api/diagrams/generate")
    print("   - GET  /api/diagrams/source/<type>")
    print("   - POST /api/diagrams/update")
    print("   - POST /api/ai/generate")
    print("   - POST /api/ai/describe")
    print("   - GET  /api/ai/list")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=6060, debug=True, use_reloader=False)
