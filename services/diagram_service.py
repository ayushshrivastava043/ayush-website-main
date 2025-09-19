import os
import subprocess
import tempfile
import json
import base64
from typing import Dict, List, Optional
from flask import Blueprint, request, jsonify, send_file
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DiagramGenerator:
    def __init__(self, workflow_diagrams_path: str):
        self.workflow_diagrams_path = workflow_diagrams_path
        self.supported_formats = ['png', 'svg', 'pdf']
        logger.info(f"DiagramGenerator initialized with path: {workflow_diagrams_path}")
        
    def generate_plantuml_diagram(self, 
                                 diagram_type: str, 
                                 output_format: str = 'png',
                                 custom_content: Optional[str] = None) -> Dict:
        """
        Generate PlantUML diagram
        
        Args:
            diagram_type: Type of diagram (architecture, sequence, deployment, class_diagram, component_diagram)
            output_format: Output format (png, svg, pdf)
            custom_content: Optional custom PlantUML content
            
        Returns:
            Dict with status, file_data, and metadata
        """
        try:
            logger.info(f"Generating {diagram_type} diagram in {output_format} format")
            
            # Determine source file
            source_file = f"{self.workflow_diagrams_path}/plantuml_{diagram_type}.puml"
            logger.info(f"Looking for source file: {source_file}")
            
            if not os.path.exists(source_file):
                error_msg = f'Source file {source_file} not found'
                logger.error(error_msg)
                return {
                    'status': 'error',
                    'message': error_msg
                }
            
            # Create temporary output directory
            with tempfile.TemporaryDirectory() as temp_dir:
                logger.info(f"Using temporary directory: {temp_dir}")
                
                # Generate diagram
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
                
                # Find generated file
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
                
                # Read file and encode as base64
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
    
    def update_diagram_source(self, diagram_type: str, source: str) -> Dict:
        """Update PlantUML source code for a diagram"""
        try:
            source_file = f"{self.workflow_diagrams_path}/plantuml_{diagram_type}.puml"
            
            with open(source_file, 'w', encoding='utf-8') as f:
                f.write(source)
            
            logger.info(f"Successfully updated source code for {diagram_type}")
            return {
                'status': 'success',
                'message': 'Diagram updated successfully'
            }
        except Exception as e:
            error_msg = f'Update failed: {str(e)}'
            logger.error(error_msg)
            return {
                'status': 'error',
                'message': error_msg
            }

# Create Blueprint for diagram routes
diagram_bp = Blueprint('diagram', __name__, url_prefix='/api/diagrams')

# Initialize diagram generator
WORKFLOW_DIAGRAMS_PATH = "/Users/ayush/AI_Projects/agenticchatbot/WorkflowDiagrams"
diagram_generator = DiagramGenerator(WORKFLOW_DIAGRAMS_PATH)

@diagram_bp.route('/list', methods=['GET'])
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

@diagram_bp.route('/generate', methods=['POST'])
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

@diagram_bp.route('/source/<diagram_type>', methods=['GET'])
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

@diagram_bp.route('/update', methods=['POST'])
def update_diagram():
    """Update diagram source code"""
    try:
        data = request.json
        diagram_type = data.get('type')
        source = data.get('source')
        
        if not diagram_type or not source:
            return jsonify({
                'status': 'error',
                'message': 'Diagram type and source are required'
            }), 400
        
        result = diagram_generator.update_diagram_source(diagram_type, source)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error updating diagram: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Failed to update diagram: {str(e)}'
        }), 500

@diagram_bp.route('/health', methods=['GET'])
def health_check():
    """Health check for diagram service"""
    try:
        # Check if PlantUML is available
        result = subprocess.run(['plantuml', '-version'], capture_output=True, text=True)
        plantuml_available = result.returncode == 0
        
        # Check if workflow diagrams directory exists
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
