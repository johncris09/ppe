<?php

defined('BASEPATH') or exit('No direct script access allowed');

class MotorVehicleModel extends CI_Model
{

	public $table = 'mv';

	public function __construct()
	{
		parent::__construct();
	}

	public function get()
	{ 

		$query = $this->db
			->select('
				mv.id, 
				mv.plate_number`, 
				mv.model`, 
				mv.created_at,
				mv.engine_number`, 
				mv.chassis_number`, 
				mv.date_acquired`, 
				mv.cost`, 
				mv.status`, 
				mv.return_number`, 
				mv.return_date`, 
				mv.vehicle_type`, 
				mv.quantity`, 
				mv.fuel_type`, 
				mv.vehicle_use`, 
				mv.cylinder_number`, 
				mv.engine_displacement,
				office.id office_id,
				office.abbr,
				office.office
			
			')
			->from('mv')
			->join('office', 'mv.office = office.id', 'LEFT')
			->order_by('mv.id desc')
			->get();
		return $query->result();


	}

	public function find($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->get($this->table);
		return $query->row();
	}

	public function insert($data)
	{
		return $this->db->insert($this->table, $data);
	}

	public function update($id, $data)
	{
		$this->db->where('id', $id);
		return $this->db->update($this->table, $data);
	}

	public function delete($id)
	{
		return $this->db->delete($this->table, ['id' => $id]);
	}


}
